import { NextRequest } from "next/server";
import { twiml, twilioConfigured, processTranscript } from "@/lib/twilio";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  if (!twilioConfigured()) {
    return twiml("<Message>Service not configured.</Message>");
  }

  const form = await request.formData();
  const body = (form.get("Body") as string) || "";

  if (!body.trim()) {
    return twiml("<Message>Send me what you need — like: log $50 lumber at Home Depot for the Smith job</Message>");
  }

  const result = await processTranscript(body.trim());

  return twiml(`<Message>${escapeXml(result.summary)}</Message>`);
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
