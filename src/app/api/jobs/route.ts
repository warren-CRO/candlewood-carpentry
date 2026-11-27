import { NextRequest, NextResponse } from "next/server";
import { getOpportunities, ghlConfigured } from "@/lib/ghl";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!ghlConfigured()) {
    return NextResponse.json({ success: false, error: "GHL not configured" }, { status: 503 });
  }

  const status = (request.nextUrl.searchParams.get("status") || "all") as "open" | "won" | "lost" | "abandoned" | "all";
  const opportunities = await getOpportunities(status);

  return NextResponse.json({ success: true, jobs: opportunities });
}
