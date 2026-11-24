import { NextResponse } from "next/server";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LEADS_DIR = path.join(process.cwd(), "data", "leads");

export async function GET() {
  let files: string[];
  try {
    files = (await readdir(LEADS_DIR)).filter((f) => f.endsWith(".json"));
  } catch {
    return NextResponse.json([]);
  }

  const leads = await Promise.all(
    files.map(async (file) => {
      try {
        const data = JSON.parse(await readFile(path.join(LEADS_DIR, file), "utf8"));
        return { id: file, ...data };
      } catch {
        return null;
      }
    }),
  );

  const sorted = leads
    .filter((l): l is NonNullable<typeof l> => l !== null)
    .sort((a, b) => String(b.receivedAt ?? b.id).localeCompare(String(a.receivedAt ?? a.id)));

  return NextResponse.json(sorted);
}
