const GHL_API_KEY = process.env.GHL_API_KEY || "";
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || "";
const GHL_PIPELINE_ID = "w1PnHgnYk1fNhW34ZgYg";
const GHL_NEW_LEAD_STAGE_ID = "18f889b0-398b-4afc-917c-9d9c4c1ce532";
const GHL_BASE = "https://services.leadconnectorhq.com";

const headers = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  "Content-Type": "application/json",
  Version: "2021-07-28",
};

export function ghlConfigured(): boolean {
  return !!(GHL_API_KEY && GHL_LOCATION_ID);
}

export interface LeadInfo {
  name: string;
  phone: string;
  need: string;
  transcript: string;
}

export async function createContact(lead: LeadInfo): Promise<string | null> {
  if (!ghlConfigured()) return null;

  const nameParts = lead.name.split(" ");
  const firstName = nameParts[0] || "Unknown";
  const lastName = nameParts.slice(1).join(" ") || "";

  const res = await fetch(`${GHL_BASE}/contacts/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      firstName,
      lastName,
      phone: lead.phone,
      locationId: GHL_LOCATION_ID,
      source: "AI Receptionist",
      tags: ["inbound-lead", "ai-receptionist"],
    }),
  });

  if (!res.ok) {
    const existing = await res.json().catch(() => null);
    if (existing?.contactId) return existing.contactId;
    return null;
  }

  const data = (await res.json()) as { contact?: { id?: string } };
  return data.contact?.id || null;
}

export async function addNote(
  contactId: string,
  body: string,
): Promise<boolean> {
  if (!ghlConfigured()) return false;

  const res = await fetch(`${GHL_BASE}/contacts/${contactId}/notes/`, {
    method: "POST",
    headers,
    body: JSON.stringify({ body, locationId: GHL_LOCATION_ID }),
  });

  return res.ok;
}

export async function addToPipeline(
  contactId: string,
  name: string,
): Promise<boolean> {
  if (!ghlConfigured()) return false;

  const res = await fetch(`${GHL_BASE}/opportunities/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      pipelineId: GHL_PIPELINE_ID,
      pipelineStageId: GHL_NEW_LEAD_STAGE_ID,
      locationId: GHL_LOCATION_ID,
      name,
      contactId,
      status: "open",
    }),
  });

  return res.ok;
}

export async function pushLead(lead: LeadInfo): Promise<void> {
  const contactId = await createContact(lead);
  if (!contactId) return;

  await Promise.all([
    addNote(
      contactId,
      `📞 Voicemail via AI Receptionist\n\nCaller: ${lead.name}\nNeed: ${lead.need}\nPhone: ${lead.phone}\n\nFull transcript:\n${lead.transcript}`,
    ),
    addToPipeline(contactId, `${lead.name} — ${lead.need}`),
  ]);
}
