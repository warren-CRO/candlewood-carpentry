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
      tags: ["inbound-lead", "ai-receptionist", "followup-pending"],
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

export const PIPELINE_STAGES: Record<string, string> = {
  "18f889b0-398b-4afc-917c-9d9c4c1ce532": "New Lead",
  "bc15dd1d-fe1c-4661-8c16-e09acfc42a72": "Contacted",
  "898b1e72-a224-43b7-b2ef-2109963a980c": "Site Visit Scheduled",
  "c9cbc648-8813-438b-9505-669d704dab94": "Estimate Sent",
  "441065be-022d-4b50-b195-2eac1ce6f783": "Proposal Sent",
  "won-under-contract": "Won / Under Contract",
  "in-progress": "In Progress",
  "job-complete": "Job Complete",
  "invoice-sent": "Invoice Sent",
  "paid": "Paid",
  "lost": "Lost",
};

export interface Opportunity {
  id: string;
  name: string;
  status: string;
  pipelineStageId: string;
  stageName: string;
  monetaryValue: number;
  contactId: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

export async function getOpportunities(status: "open" | "won" | "lost" | "abandoned" | "all" = "all"): Promise<Opportunity[]> {
  if (!ghlConfigured()) return [];

  const params = new URLSearchParams({
    location_id: GHL_LOCATION_ID,
    pipeline_id: GHL_PIPELINE_ID,
    limit: "100",
  });
  if (status !== "all") params.set("status", status);

  const res = await fetch(`${GHL_BASE}/opportunities/search?${params}`, { headers });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    opportunities: Array<{
      id: string;
      name: string;
      status: string;
      pipelineStageId: string;
      monetaryValue: number;
      contact: { id: string; name: string; phone: string; email: string };
      createdAt: string;
      updatedAt: string;
    }>;
  };

  return (data.opportunities || []).map((o) => ({
    id: o.id,
    name: o.name,
    status: o.status,
    pipelineStageId: o.pipelineStageId,
    stageName: PIPELINE_STAGES[o.pipelineStageId] || "Unknown",
    monetaryValue: o.monetaryValue || 0,
    contactId: o.contact?.id || "",
    contactName: o.contact?.name || "",
    contactPhone: o.contact?.phone || "",
    contactEmail: o.contact?.email || "",
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  }));
}

export async function getOpportunity(id: string): Promise<Opportunity | null> {
  if (!ghlConfigured()) return null;

  const res = await fetch(`${GHL_BASE}/opportunities/${id}`, { headers });
  if (!res.ok) return null;

  const o = (await res.json()) as {
    id: string;
    name: string;
    status: string;
    pipelineStageId: string;
    monetaryValue: number;
    contact: { id: string; name: string; phone: string; email: string };
    createdAt: string;
    updatedAt: string;
  };

  return {
    id: o.id,
    name: o.name,
    status: o.status,
    pipelineStageId: o.pipelineStageId,
    stageName: PIPELINE_STAGES[o.pipelineStageId] || "Unknown",
    monetaryValue: o.monetaryValue || 0,
    contactId: o.contact?.id || "",
    contactName: o.contact?.name || "",
    contactPhone: o.contact?.phone || "",
    contactEmail: o.contact?.email || "",
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

export async function getNotes(contactId: string): Promise<Array<{ id: string; body: string; dateAdded: string }>> {
  if (!ghlConfigured()) return [];

  const res = await fetch(`${GHL_BASE}/contacts/${contactId}/notes/`, { headers });
  if (!res.ok) return [];

  const data = (await res.json()) as { notes: Array<{ id: string; body: string; dateAdded: string }> };
  return data.notes || [];
}

export async function updateOpportunityValue(oppId: string, value: number): Promise<boolean> {
  if (!ghlConfigured()) return false;

  const res = await fetch(`${GHL_BASE}/opportunities/${oppId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ monetaryValue: value }),
  });

  return res.ok;
}
