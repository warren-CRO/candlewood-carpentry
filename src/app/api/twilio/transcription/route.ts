import { NextRequest } from "next/server";
import { twiml, sendSms, processTranscript, isChad, verifyTwilioRequest } from "@/lib/twilio";
import { parseLeadTranscript } from "@/lib/lead-parser";
import { pushLead } from "@/lib/ghl";

export const runtime = "nodejs";
export const maxDuration = 30;

const CHAD_PHONE = "+12034707424";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const params: Record<string, string> = {};
  form.forEach((v, k) => { params[k] = v.toString(); });

  const sig = request.headers.get("x-twilio-signature");
  if (!verifyTwilioRequest(request.url, params, sig)) {
    return new Response("Forbidden", { status: 403 });
  }

  const transcript = params["TranscriptionText"] || "";
  const from = params["From"] || "";
  const status = params["TranscriptionStatus"] || "";

  if (status !== "completed" || !transcript.trim()) {
    return twiml("");
  }

  if (isChad(from)) {
    const result = await processTranscript(transcript.trim());
    if (from) await sendSms(from, result.summary);
    return twiml("");
  }

  const lead = await parseLeadTranscript(transcript.trim());
  const callerPhone = lead.phone || from;
  const callerName = lead.name || "Unknown Caller";
  const callerNeed = lead.need || "General inquiry";

  const urgencyFlag = lead.urgency === "high" ? "🔴 URGENT " : "🔴 ";

  await Promise.all([
    sendSms(
      from,
      `Thanks for calling Candlewood Carpentry! Chad got your message and will call you back shortly. If you need to reach him sooner, text this number with your details.`,
    ),

    sendSms(
      CHAD_PHONE,
      `${urgencyFlag}NEW LEAD\n${callerName}\nNeeds: ${callerNeed}\nCallback: ${callerPhone}\n\nVoicemail: "${transcript.trim().slice(0, 300)}"`,
    ),

    pushLead({
      name: callerName,
      phone: from,
      need: callerNeed,
      transcript: transcript.trim(),
    }),
  ]);

  return twiml("");
}
