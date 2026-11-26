import { createHmac } from "crypto";

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";
const CHAD_PHONE = "+12034707424";

export function isChad(from: string): boolean {
  return from.replace(/\D/g, "").endsWith("2034707424");
}

export function twilioConfigured(): boolean {
  return !!(TWILIO_SID && TWILIO_TOKEN && TWILIO_NUMBER);
}

export function validateTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string,
): boolean {
  if (!TWILIO_TOKEN || !signature) return false;

  const sortedKeys = Object.keys(params).sort();
  let data = url;
  for (const key of sortedKeys) {
    data += key + params[key];
  }

  const expected = createHmac("sha1", TWILIO_TOKEN)
    .update(data)
    .digest("base64");

  return signature === expected;
}

export function verifyTwilioRequest(
  requestUrl: string,
  params: Record<string, string>,
  signatureHeader: string | null,
): boolean {
  if (!signatureHeader) return false;

  const accountSid = params["AccountSid"] || "";
  if (accountSid && accountSid !== TWILIO_SID) return false;

  const baseUrl = process.env.URL || process.env.DEPLOY_URL || "https://candlewoodcarpentryllc.netlify.app";
  const path = new URL(requestUrl).pathname;
  const canonicalUrl = baseUrl + path;

  return validateTwilioSignature(canonicalUrl, params, signatureHeader);
}

export async function sendSms(to: string, body: string): Promise<boolean> {
  if (!twilioConfigured()) return false;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
  const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64");

  const params = new URLSearchParams();
  params.set("To", to);
  params.set("From", TWILIO_NUMBER);
  params.set("Body", body);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  return res.ok;
}

export function twiml(xml: string): Response {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response>${xml}</Response>`,
    { headers: { "Content-Type": "text/xml; charset=utf-8" } },
  );
}

export async function processTranscript(
  transcript: string,
): Promise<{ action: string; summary: string }> {
  const baseUrl = process.env.URL || process.env.DEPLOY_URL || "https://candlewoodcarpentryllc.netlify.app";

  const res = await fetch(`${baseUrl}/api/voice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });

  if (!res.ok) {
    return { action: "error", summary: "Couldn't process that. Try again." };
  }

  const data = (await res.json()) as {
    success: boolean;
    action: string;
    message?: string;
    number?: string;
    data?: Record<string, unknown>;
    error?: string;
  };

  if (!data.success) {
    return { action: "error", summary: data.error || "Something went wrong." };
  }

  if (data.action === "clarify") {
    return { action: "clarify", summary: data.message || "Can you say that again?" };
  }

  if (data.action === "receipt") {
    const d = data.data as Record<string, unknown> | undefined;
    const store = (d?.store as string) || "store";
    const items = (d?.items as Array<Record<string, unknown>>) || [];
    return {
      action: "receipt",
      summary: `Got it. Logged ${items.length} item(s) from ${store}.`,
    };
  }

  if (data.action === "estimate") {
    return {
      action: "estimate",
      summary: `Estimate ${data.number || ""} created. Open your Tools page to review.`.trim(),
    };
  }

  if (data.action === "invoice") {
    return {
      action: "invoice",
      summary: `Invoice ${data.number || ""} created. Open your Tools page to review.`.trim(),
    };
  }

  return { action: data.action, summary: "Done." };
}
