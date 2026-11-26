import { twiml, twilioConfigured } from "@/lib/twilio";

export const runtime = "nodejs";

export async function POST() {
  if (!twilioConfigured()) {
    return twiml("<Say>This service is not configured yet. Goodbye.</Say><Hangup/>");
  }

  const baseUrl = process.env.URL || process.env.DEPLOY_URL || "https://candlewoodcarpentryllc.netlify.app";

  return twiml(
    `<Say voice="alice">Hey, it's your Traction assistant. What do you need? Leave your message after the beep.</Say>` +
    `<Record maxLength="120" transcribe="true" transcribeCallback="${baseUrl}/api/twilio/transcription" />` +
    `<Say voice="alice">I didn't catch anything. Try calling back.</Say>`,
  );
}
