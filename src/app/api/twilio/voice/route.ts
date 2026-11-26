import { NextRequest } from "next/server";
import { twiml, twilioConfigured, isChad, verifyTwilioRequest } from "@/lib/twilio";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!twilioConfigured()) {
    return twiml("<Say>This service is not configured yet. Goodbye.</Say><Hangup/>");
  }

  const form = await request.formData();
  const params: Record<string, string> = {};
  form.forEach((v, k) => { params[k] = v.toString(); });

  const sig = request.headers.get("x-twilio-signature");
  if (!verifyTwilioRequest(request.url, params, sig)) {
    return new Response("Forbidden", { status: 403 });
  }

  const from = params["From"] || "";
  const baseUrl = process.env.URL || process.env.DEPLOY_URL || "https://candlewoodcarpentryllc.netlify.app";

  if (isChad(from)) {
    return twiml(
      `<Say voice="alice">Hey, it's your Traction assistant. What do you need? Leave your message after the beep.</Say>` +
      `<Record maxLength="120" transcribe="true" transcribeCallback="${baseUrl}/api/twilio/transcription" />` +
      `<Say voice="alice">I didn't catch anything. Try calling back.</Say>`,
    );
  }

  return twiml(
    `<Say voice="alice">Thanks for calling Candlewood Carpentry. Chad's on a job right now. Leave your name, what you need done, and the best number to reach you, and we'll get back to you within 24 hours. If this is a personal call, just shoot him a text.</Say>` +
    `<Record maxLength="120" transcribe="true" transcribeCallback="${baseUrl}/api/twilio/transcription" />` +
    `<Say voice="alice">We didn't catch anything. Try calling back. Thanks.</Say>`,
  );
}
