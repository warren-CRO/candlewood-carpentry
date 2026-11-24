import { NextRequest, NextResponse } from "next/server";
import { generateInvoice, type InvoiceInput } from "@/lib/generate-invoice";

export const runtime = "nodejs";

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

  const input = body as InvoiceInput;
  if (!input?.client?.name || !input?.project?.description) {
    return fail("Missing required fields: client.name, project.description");
  }

  if (!input?.lineItems?.length) {
    return fail("Missing required field: lineItems (must have at least one)");
  }

  try {
    const result = generateInvoice(input);
    const wantHtml = request.nextUrl.searchParams.get("format") === "html";
    if (wantHtml) {
      return new NextResponse(result.html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
    return NextResponse.json({ success: true, html: result.html, number: result.number });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Generation failed";
    return fail(msg, 500);
  }
}
