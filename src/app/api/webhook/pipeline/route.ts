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

const STAGE_NOTES: Record<string, string> = {
  "New Lead": "New lead entered the pipeline. Follow up within 24 hours.",
  "Contacted": "Initial contact made. Qualify the lead and schedule a site visit if appropriate.",
  "Site Visit Scheduled": "Site visit is on the calendar. Prepare by reviewing project scope notes.",
  "Estimate Sent": "Estimate delivered to the client. Follow up in 3-5 days if no response.",
  "Proposal Sent": "Formal proposal sent. This includes payment terms and T&Cs. Follow up in 5-7 days.",
  "Won / Under Contract": "Job won! Client accepted the proposal. Schedule the work and confirm start date.",
  "In Progress": "Work is underway. Track progress and communicate any changes to the client.",
  "Job Complete": "Job finished. Conduct final walkthrough with the client and prepare the invoice.",
  "Invoice Sent": "Invoice delivered. Payment expected within 30 days per terms.",
  "Paid": "Payment received. Send a thank-you note and request a Google review.",
  "Lost": "Opportunity lost. Note the reason for future reference.",
};

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
  const previousStage = payload.previousStage || "unknown";
  const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const stageGuidance = STAGE_NOTES[stageName] || "";

  console.log(`[pipeline-webhook] ${opp.name} moved from "${previousStage}" to "${stageName}" at ${timestamp}`);

  const noteLines = [
    `Pipeline update: moved to "${stageName}" on ${timestamp}`,
    previousStage !== "unknown" ? `Previous stage: ${previousStage}` : "",
    opp.monetaryValue ? `Value: $${opp.monetaryValue.toLocaleString()}` : "",
    stageGuidance ? `\nNext step: ${stageGuidance}` : "",
  ].filter(Boolean);

  await addContactNote(opp.contactId, noteLines.join("\n"));

  return NextResponse.json({
    success: true,
    action: "noted",
    stage: stageName,
    previousStage,
    opportunityId: opp.id,
  });
}
