import { NextRequest, NextResponse } from "next/server";
import { getOpportunity, getNotes, addNote, ghlConfigured } from "@/lib/ghl";

export const runtime = "nodejs";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!ghlConfigured()) {
    return NextResponse.json({ success: false, error: "GHL not configured" }, { status: 503 });
  }

  const { id } = await params;
  const opp = await getOpportunity(id);
  if (!opp) {
    return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
  }

  const notes = opp.contactId ? await getNotes(opp.contactId) : [];

  const expenses: Array<{ description: string; amount: number; date: string }> = [];
  let revenue = opp.monetaryValue;

  for (const note of notes) {
    const expenseMatch = note.body.match(/^💰 EXPENSE: (.+)\nAmount: \$([0-9,.]+)\n/);
    if (expenseMatch) {
      expenses.push({
        description: expenseMatch[1],
        amount: parseFloat(expenseMatch[2].replace(/,/g, "")),
        date: note.dateAdded,
      });
    }
    const revenueMatch = note.body.match(/^💵 REVENUE SET: \$([0-9,.]+)/);
    if (revenueMatch) {
      revenue = parseFloat(revenueMatch[1].replace(/,/g, ""));
    }
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return NextResponse.json({
    success: true,
    job: opp,
    expenses,
    totalExpenses,
    revenue,
    profit: revenue - totalExpenses,
    margin: revenue > 0 ? ((revenue - totalExpenses) / revenue) * 100 : 0,
  });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!ghlConfigured()) {
    return NextResponse.json({ success: false, error: "GHL not configured" }, { status: 503 });
  }

  const { id } = await params;
  const opp = await getOpportunity(id);
  if (!opp || !opp.contactId) {
    return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
  }

  let body: { type: string; description?: string; amount?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (body.type === "expense") {
    if (!body.description || !body.amount || body.amount <= 0) {
      return NextResponse.json({ success: false, error: "Missing description or amount" }, { status: 400 });
    }
    const noteBody = `💰 EXPENSE: ${body.description}\nAmount: $${body.amount.toFixed(2)}\nDate: ${new Date().toLocaleDateString("en-US")}`;
    const ok = await addNote(opp.contactId, noteBody);
    return NextResponse.json({ success: ok });
  }

  if (body.type === "revenue") {
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({ success: false, error: "Missing amount" }, { status: 400 });
    }
    const noteBody = `💵 REVENUE SET: $${body.amount.toFixed(2)}\nDate: ${new Date().toLocaleDateString("en-US")}`;
    const ok = await addNote(opp.contactId, noteBody);
    return NextResponse.json({ success: ok });
  }

  return NextResponse.json({ success: false, error: "Unknown type" }, { status: 400 });
}
