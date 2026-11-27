import { NextRequest, NextResponse } from "next/server";
import { generateProposal, type ProposalInput } from "@/lib/generate-proposal";

export const runtime = "nodejs";

function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const input = body as ProposalInput;
  if (!input?.client?.name || !input?.project?.type || !input?.project?.scope) {
    return fail("Missing required fields: client.name, project.type, project.scope");
  }

  if (input.project.sqft === undefined) {
    return fail("Missing required field: project.sqft");
  }

  try {
    const result = generateProposal(input);
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
