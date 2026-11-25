import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return fail("Vision API not configured", 503);
  }

  let body: { image: string };
  try {
    body = await request.json();
  } catch {
    return fail("Invalid JSON body");
  }

  if (!body.image) {
    return fail("Missing image field (base64 data URL)");
  }

  const match = body.image.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    return fail("Image must be a base64 data URL (data:image/jpeg;base64,...)");
  }

  const mediaType = match[1] as "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  const imageData = match[2];

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: imageData },
              },
              {
                type: "text",
                text: `You are a receipt parser for a carpentry/contracting business. Analyze this receipt photo.

The contractor may have written client/job names next to items by hand. Look for handwritten notes near line items.

Return ONLY valid JSON with this exact structure — no markdown, no explanation:
{
  "store": "Store name from the receipt",
  "date": "YYYY-MM-DD from the receipt",
  "items": [
    {
      "description": "Item description from receipt",
      "amount": 12.99,
      "category": "Materials",
      "job": "Client name if handwritten nearby, otherwise empty string"
    }
  ],
  "subtotal": 99.99,
  "tax": 6.35,
  "total": 106.34
}

Category must be one of: Materials, Labor, Tools/Equipment, Fuel, Permits, Meals, Office/Supplies, Other.
For a hardware/home improvement store, most items are "Materials" unless clearly tools.
If you can read handwritten text near an item, put it in the "job" field.
If you cannot read the receipt clearly, still return your best guess with what you can see.
Amounts must be numbers, not strings.`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = (err as Record<string, Record<string, string>>)?.error?.message || `API returned ${response.status}`;
      return fail(`Vision API error: ${msg}`, 502);
    }

    const result = await response.json() as {
      content: Array<{ type: string; text?: string }>;
    };
    const text = result.content?.[0]?.text || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return fail("Could not parse receipt — try a clearer photo", 422);
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      store: string;
      date: string;
      items: Array<{ description: string; amount: number; category: string; job: string }>;
      subtotal?: number;
      tax?: number;
      total: number;
    };

    if (!parsed.items || !Array.isArray(parsed.items)) {
      return fail("Could not extract line items — try a clearer photo", 422);
    }

    return NextResponse.json({ success: true, receipt: parsed });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Vision processing failed";
    return fail(msg, 500);
  }
}
