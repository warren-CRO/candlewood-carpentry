import { NextRequest, NextResponse } from "next/server";
import { generateEstimate, type EstimateInput } from "@/lib/generate-estimate";
import { generateInvoice, type InvoiceInput } from "@/lib/generate-invoice";

export const runtime = "nodejs";
export const maxDuration = 30;

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

const SYSTEM_PROMPT = `You are a voice assistant for Chad Colesworthy, owner of Candlewood Carpentry LLC in Sherman, CT. Chad speaks to you while working on job sites, at the store, or in his truck. Parse what he says and decide which action to take.

You MUST respond with ONLY valid JSON — no markdown, no explanation, no extra text.

There are 3 possible actions:

1. LOG A RECEIPT — when Chad mentions buying something, spending money, a purchase, materials, a store trip
{
  "action": "receipt",
  "data": {
    "store": "Store name",
    "date": "YYYY-MM-DD (today if not specified)",
    "items": [{"description": "Item description", "amount": 12.99, "category": "Materials", "job": "Client last name or job name if mentioned"}]
  }
}

2. CREATE AN ESTIMATE — when Chad mentions an estimate, quote, pricing for a client, bidding a job
{
  "action": "estimate",
  "data": {
    "client": {"name": "Client name", "address": "Address if mentioned"},
    "project": {
      "type": "one of: interior-painting, exterior-painting, exterior-staining, window-replacement, exterior-renovation, kitchen-remodel, bathroom-remodel, deck-build, deck-repair, room-addition, custom-cabinetry, trim-work, framing, siding, roofing, general-carpentry",
      "scope": "Description of the work",
      "sqft": 0
    },
    "scopeItems": [{"description": "Line item", "amount": 0}]
  }
}
If Chad gives specific prices/items, use scopeItems. If he gives sqft, use project.sqft and omit scopeItems.

3. CREATE AN INVOICE — when Chad mentions invoicing, billing, charging a client for completed work
{
  "action": "invoice",
  "data": {
    "client": {"name": "Client name", "address": "Address if mentioned"},
    "project": {"type": "general-carpentry", "description": "Description of completed work"},
    "lineItems": [{"description": "Work done", "amount": 0}]
  }
}

If Chad says something that doesn't match any action, respond:
{"action": "clarify", "message": "A short, friendly question to understand what Chad needs"}

Today's date is ${new Date().toISOString().split("T")[0]}.
Use "Materials" as the default category for store purchases. Use the client/job name if Chad mentions one.
If amounts aren't specified, use 0 and note it in descriptions so Chad can fill them in.
Keep it practical — Chad talks like a contractor, not a software engineer.`;

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return fail("Voice assistant not configured", 503);
  }

  let body: { transcript: string };
  try {
    body = await request.json();
  } catch {
    return fail("Invalid JSON body");
  }

  if (!body.transcript?.trim()) {
    return fail("No transcript provided");
  }

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
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: body.transcript.trim() }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = (err as Record<string, Record<string, string>>)?.error?.message || `API returned ${response.status}`;
      return fail(`AI error: ${msg}`, 502);
    }

    const result = await response.json() as {
      content: Array<{ type: string; text?: string }>;
    };
    const text = result.content?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return fail("Could not understand — try again", 422);
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      action: string;
      data?: Record<string, unknown>;
      message?: string;
    };

    if (parsed.action === "clarify") {
      return NextResponse.json({ success: true, action: "clarify", message: parsed.message });
    }

    if (parsed.action === "receipt") {
      return NextResponse.json({ success: true, action: "receipt", data: parsed.data });
    }

    if (parsed.action === "estimate" && parsed.data) {
      try {
        const input = parsed.data as unknown as EstimateInput;
        if (!input.client?.name) input.client = { name: "TBD", address: "" };
        if (!input.project?.type) input.project = { ...input.project, type: "general-carpentry" };
        if (!input.project?.scope) input.project.scope = "As discussed";
        if (!input.scopeItems?.length && !input.project.sqft) input.project.sqft = 100;
        const doc = generateEstimate(input);
        return NextResponse.json({ success: true, action: "estimate", html: doc.html, number: doc.number, data: parsed.data });
      } catch (err) {
        return NextResponse.json({ success: true, action: "estimate", data: parsed.data, generateError: String(err) });
      }
    }

    if (parsed.action === "invoice" && parsed.data) {
      try {
        const input = parsed.data as unknown as InvoiceInput;
        if (!input.client?.name) input.client = { name: "TBD", address: "" };
        if (!input.project?.description) input.project = { ...input.project, description: "Work completed" };
        if (!input.lineItems?.length) input.lineItems = [{ description: "Work completed", amount: 0 }];
        const doc = generateInvoice(input);
        return NextResponse.json({ success: true, action: "invoice", html: doc.html, number: doc.number, data: parsed.data });
      } catch (err) {
        return NextResponse.json({ success: true, action: "invoice", data: parsed.data, generateError: String(err) });
      }
    }

    return NextResponse.json({ success: true, action: parsed.action, data: parsed.data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Voice processing failed";
    return fail(msg, 500);
  }
}
