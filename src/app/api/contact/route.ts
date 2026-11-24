import { NextRequest, NextResponse } from "next/server";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const LEADS_DIR = path.join(process.cwd(), "data", "leads");
const FIELDS = ["name", "phone", "email", "town", "service", "details"] as const;
type Field = (typeof FIELDS)[number];
type Submission = Record<Field, string>;

function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "lead"
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request body.");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return fail("Invalid request body.");
  }

  const raw = body as Record<string, unknown>;
  const submission = {} as Submission;
  for (const field of FIELDS) {
    const value = raw[field];
    if (value !== undefined && typeof value !== "string") {
      return fail(`Field "${field}" must be a string.`);
    }
    submission[field] = (value ?? "").trim().slice(0, field === "details" ? 5000 : 200);
  }

  if (!submission.name) return fail("Please enter your name.");
  if (!submission.details) return fail("Please describe your project.");
  if (!submission.phone && !submission.email) {
    return fail("Please include a phone number or an email so Chad can reach you.");
  }

  const receivedAt = new Date().toISOString();
  const stamp = receivedAt.replace(/[:.]/g, "-");
  let filename = `${stamp}_${slugify(submission.name)}.json`;
  const record = { ...submission, receivedAt, status: "new" as const };

  try {
    await mkdir(LEADS_DIR, { recursive: true });
    let filePath = path.join(LEADS_DIR, filename);
    if (await access(filePath).then(() => true, () => false)) {
      filename = `${stamp}_${slugify(submission.name)}-${crypto.randomUUID().slice(0, 6)}.json`;
      filePath = path.join(LEADS_DIR, filename);
    }
    await writeFile(filePath, JSON.stringify(record, null, 2) + "\n", "utf8");
  } catch (err) {
    console.error("Failed to store lead:", err);
    return fail("We could not save your request. Please call us instead.", 500);
  }

  // TODO: Forward to GHL webhook when sub-account is provisioned

  return NextResponse.json({ success: true, id: filename });
}
