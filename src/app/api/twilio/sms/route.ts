import { NextRequest } from "next/server";
import { twiml, twilioConfigured, processTranscript, sendSms, isChad, verifyTwilioRequest } from "@/lib/twilio";
import { parseLeadTranscript } from "@/lib/lead-parser";
import { pushLead } from "@/lib/ghl";

export const runtime = "nodejs";
export const maxDuration = 30;

const CHAD_PHONE = "+12034707424";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function scanReceiptImage(imageUrl: string): Promise<string> {
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) return "Couldn't download the image. Try again.";

  const buffer = await imgRes.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const contentType = imgRes.headers.get("content-type") || "image/jpeg";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: contentType, data: base64 },
          },
          {
            type: "text",
            text: `You are a receipt scanner for a carpentry contractor. Quickly summarize this receipt: store name, date, total, and list up to 5 key items with prices. Keep it under 300 characters for SMS. Format: "Store — $total on MM/DD. Items: item1 $X, item2 $Y..." If this isn't a receipt, say what you see briefly.`,
          },
        ],
      }],
    }),
  });

  if (!response.ok) return "Couldn't read the image. Try a clearer photo.";

  const result = await response.json() as { content: Array<{ text?: string }> };
  return result.content?.[0]?.text || "Couldn't parse that image.";
}

export async function POST(request: NextRequest) {
  if (!twilioConfigured()) {
    return twiml("<Message>Service not configured.</Message>");
  }

  const form = await request.formData();
  const params: Record<string, string> = {};
  form.forEach((v, k) => { params[k] = v.toString(); });

  const sig = request.headers.get("x-twilio-signature");
  if (!verifyTwilioRequest(request.url, params, sig)) {
    return new Response("Forbidden", { status: 403 });
  }

  const body = params["Body"] || "";
  const from = params["From"] || "";
  const numMedia = parseInt(params["NumMedia"] || "0", 10);

  if (isChad(from)) {
    if (numMedia > 0 && ANTHROPIC_API_KEY) {
      const mediaUrl = params["MediaUrl0"] || "";
      if (mediaUrl) {
        const summary = await scanReceiptImage(mediaUrl);
        return twiml(`<Message>${escapeXml(summary)}</Message>`);
      }
    }

    if (!body.trim() && numMedia === 0) {
      return twiml("<Message>Send a message or photo and I'll help.</Message>");
    }

    const result = await processTranscript(body.trim());
    return twiml(`<Message>${escapeXml(result.summary)}</Message>`);
  }

  if (!body.trim() && numMedia === 0) {
    return twiml("<Message>Send a message and we'll get back to you!</Message>");
  }

  const messageText = body.trim() || (numMedia > 0 ? "Sent an image" : "");
  const lead = await parseLeadTranscript(messageText);
  const callerName = lead.name || "Unknown";
  const callerNeed = lead.need || messageText.slice(0, 100);

  const mediaNote = numMedia > 0 ? `\n📷 ${numMedia} image(s) attached` : "";

  sendSms(
    CHAD_PHONE,
    `🔴 NEW TEXT LEAD\nFrom: ${from}\nName: ${callerName}\nNeeds: ${callerNeed}\n\nMessage: "${messageText.slice(0, 300)}"${mediaNote}`,
  ).catch(() => {});

  pushLead({
    name: callerName,
    phone: from,
    need: callerNeed,
    transcript: messageText,
  }).catch(() => {});

  return twiml(
    `<Message>${escapeXml(
      `Thanks for texting Candlewood Carpentry! Chad will get back to you shortly. If it's urgent, try calling (203) 470-7424.`,
    )}</Message>`,
  );
}
