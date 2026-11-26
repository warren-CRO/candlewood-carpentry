import { NextRequest } from "next/server";
import { twiml, sendSms, processTranscript } from "@/lib/twilio";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const transcript = (form.get("TranscriptionText") as string) || "";
  const from = (form.get("From") as string) || "";
  const status = (form.get("TranscriptionStatus") as string) || "";

  if (status !== "completed" || !transcript.trim()) {
    return twiml("");
  }

  const result = await processTranscript(transcript.trim());

  if (from) {
    await sendSms(from, result.summary);
  }

  return twiml("");
}
