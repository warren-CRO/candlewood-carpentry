import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GHL_API = "https://services.leadconnectorhq.com";
const GHL_API_KEY = process.env.GHL_API_KEY;

interface WebhookPayload {
  type?: string;
  locationId?: string;
  opportunity?: {
    id: string;
    name: string;
    pipelineId: string;
    pipelineStageId: string;
    status: string;
    contactId: string;
    monetaryValue?: number;
  };
  previousStage?: string;
  currentStage?: string;
}

async function addContactNote(contactId: string, note: string): Promise<void> {
  if (!GHL_API_KEY) return;
  try {
    await fetch(`${GHL_API}/contacts/${contactId}/notes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify({ body: note }),
    });
  } catch (err) {
    console.error("Failed to add contact note:", err);
  }
}

export async function POST(request: NextRequest) {
  let payload: WebhookPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const opp = payload.opportunity;
  if (!opp) {
    return NextResponse.json({ success: true, action: "ignored", reason: "no opportunity data" });
  }

  const stageName = payload.currentStage || "unknown";
  const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });

  console.log(`[pipeline-webhook] ${opp.name} moved to "${stageName}" at ${timestamp}`);

  await addContactNote(
    opp.contactId,
    `Pipeline update: moved to "${stageName}" on ${timestamp}`,
  );

  return NextResponse.json({
    success: true,
    action: "noted",
    stage: stageName,
    opportunityId: opp.id,
  });
}
