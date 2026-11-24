import { NextRequest, NextResponse } from "next/server";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const LEADS_DIR = path.join(process.cwd(), "data", "leads");
const FIELDS = ["name", "phone", "email", "town", "service", "details"] as const;
type Field = (typeof FIELDS)[number];
type Submission = Record<Field, string>;

const GHL_API = "https://services.leadconnectorhq.com";
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

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

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

async function createGHLContact(submission: Submission): Promise<string | null> {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    console.warn("GHL credentials not configured — skipping CRM sync");
    return null;
  }

  const { firstName, lastName } = splitName(submission.name);

  const tags = ["lead-source:website"];
  if (submission.town) tags.push(submission.town.toLowerCase());

  const customFields = [];
  if (submission.service) {
    customFields.push({ key: "job_type", field_value: submission.service });
  }

  const body = {
    locationId: GHL_LOCATION_ID,
    firstName,
    lastName,
    phone: submission.phone || undefined,
    email: submission.email || undefined,
    tags,
    source: "website form",
    customFields,
  };

  try {
    const res = await fetch(`${GHL_API}/contacts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`GHL contact create failed (${res.status}):`, text);
      return null;
    }

    const data = await res.json();
    const contactId = data?.contact?.id;

    if (contactId && submission.details) {
      await fetch(`${GHL_API}/contacts/${contactId}/notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GHL_API_KEY}`,
          "Content-Type": "application/json",
          Version: "2021-07-28",
        },
        body: JSON.stringify({ body: submission.details }),
      });
    }

    return contactId ?? null;
  } catch (err) {
    console.error("GHL API error:", err);
    return null;
  }
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

  const ghlContactId = await createGHLContact(submission);
  if (ghlContactId) {
    console.log(`GHL contact created: ${ghlContactId}`);
  }

  const receivedAt = new Date().toISOString();
  const stamp = receivedAt.replace(/[:.]/g, "-");
  let filename = `${stamp}_${slugify(submission.name)}.json`;
  const record = { ...submission, receivedAt, status: "new" as const, ghlContactId };

  try {
    await mkdir(LEADS_DIR, { recursive: true });
    let filePath = path.join(LEADS_DIR, filename);
    if (await access(filePath).then(() => true, () => false)) {
      filename = `${stamp}_${slugify(submission.name)}-${crypto.randomUUID().slice(0, 6)}.json`;
      filePath = path.join(LEADS_DIR, filename);
    }
    await writeFile(filePath, JSON.stringify(record, null, 2) + "\n", "utf8");
  } catch {
    // File storage is a local-dev convenience; on serverless (Netlify) the
    // filesystem is read-only. GHL is the real persistence layer.
  }

  if (!ghlContactId) {
    return fail("We could not save your request. Please call us instead.", 500);
  }

  return NextResponse.json({ success: true, id: ghlContactId });
}
