import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface ReceiptItem {
  description: string;
  amount: number;
  category: string;
  job: string;
}

interface ReceiptPayload {
  store: string;
  date: string;
  items: ReceiptItem[];
  total?: number;
}

function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedKey = process.env.GHL_API_KEY;
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return fail("Unauthorized", 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const payload = body as ReceiptPayload;
  if (!payload?.store || !payload?.date || !Array.isArray(payload?.items) || payload.items.length === 0) {
    return fail("Missing required fields: store, date, items[]");
  }

  for (const item of payload.items) {
    if (typeof item.amount !== "number" || item.amount <= 0) {
      return fail("Each item must have a positive numeric amount");
    }
  }

  const total = payload.items.reduce((s, i) => s + i.amount, 0);
  const roundedTotal = Math.round(total * 100) / 100;

  const byCategory: Record<string, number> = {};
  const byJob: Record<string, number> = {};
  for (const item of payload.items) {
    const cat = item.category || "Other";
    const job = item.job?.trim() || "Unassigned";
    byCategory[cat] = (byCategory[cat] || 0) + item.amount;
    byJob[job] = (byJob[job] || 0) + item.amount;
  }

  const round = (n: number) => Math.round(n * 100) / 100;
  for (const k of Object.keys(byCategory)) byCategory[k] = round(byCategory[k]);
  for (const k of Object.keys(byJob)) byJob[k] = round(byJob[k]);

  const lines = [
    `Receipt: ${payload.store} — ${payload.date}`,
    `Total: $${roundedTotal.toFixed(2)}`,
    "",
    "Items:",
    ...payload.items.map(
      (i) => `  • ${i.description || "(no desc)"} — $${i.amount.toFixed(2)} [${i.category || "Other"}] → ${i.job?.trim() || "Unassigned"}`,
    ),
    "",
    "By Category:",
    ...Object.entries(byCategory).map(([k, v]) => `  ${k}: $${v.toFixed(2)}`),
    "",
    "By Job:",
    ...Object.entries(byJob).map(([k, v]) => `  ${k}: $${v.toFixed(2)}`),
  ];

  return NextResponse.json({
    success: true,
    summary: { total: roundedTotal, byCategory, byJob },
    formatted: lines.join("\n"),
  });
}
