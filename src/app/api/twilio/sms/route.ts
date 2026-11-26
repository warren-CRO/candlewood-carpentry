import { NextRequest } from "next/server";
import { twiml, twilioConfigured, processTranscript, sendSms, isChad } from "@/lib/twilio";
import { parseLeadTranscript } from "@/lib/lead-parser";
import { pushLead } from "@/lib/ghl";

export const runtime = "nodejs";
export const maxDuration = 30;

const CHAD_PHONE = "+12034707424";

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(request: NextRequest) {
  if (!twilioConfigured()) {
    return twiml("<Message>Service not configured.</Message>");
  }

  const form = await request.formData();
  const body = (form.get("Body") as string) || "";
  const from = (form.get("From") as string) || "";

  if (!body.trim()) {
    return twiml("<Message>Send a message and we'll get back to you!</Message>");
  }

  if (isChad(from)) {
    const result = await processTranscript(body.trim());
    return twiml(`<Message>${escapeXml(result.summary)}</Message>`);
  }

  const lead = await parseLeadTranscript(body.trim());
  const callerName = lead.name || "Unknown";
  const callerNeed = lead.need || body.trim().slice(0, 100);

  sendSms(
    CHAD_PHONE,
    `🔴 NEW TEXT LEAD\nFrom: ${from}\nName: ${callerName}\nNeeds: ${callerNeed}\n\nMessage: "${body.trim().slice(0, 300)}"`,
  ).catch(() => {});

  pushLead({
    name: callerName,
    phone: from,
    need: callerNeed,
    transcript: body.trim(),
  }).catch(() => {});

  return twiml(
    `<Message>${escapeXml(
      `Thanks for texting Candlewood Carpentry! Chad will get back to you shortly. If it's urgent, try calling (203) 470-7424.`,
    )}</Message>`,
  );
}
