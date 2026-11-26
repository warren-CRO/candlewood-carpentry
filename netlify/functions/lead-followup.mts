import type { Config } from "@netlify/functions";

const GHL_API_KEY = process.env.GHL_API_KEY || "";
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || "";
const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_PIPELINE_ID = "w1PnHgnYk1fNhW34ZgYg";

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";

const FOLLOWUP_1_DELAY_MS = 30 * 60 * 1000; // 30 minutes
const FOLLOWUP_2_DELAY_MS = 2 * 60 * 60 * 1000; // 2 hours

const FOLLOWUP_1_MSG =
  "Hey, this is Candlewood Carpentry following up — Chad got your message and is wrapping up a job. He'll give you a call shortly. If you need something sooner, reply here.";

const FOLLOWUP_2_MSG =
  "Hi again from Candlewood Carpentry — just wanted to make sure you're taken care of. Chad plans to reach out today. If your project is urgent, give us a call at (203) 470-7424 and we'll get you on the schedule.";

const ghlHeaders = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  "Content-Type": "application/json",
  Version: "2021-07-28",
};

async function sendSms(to: string, body: string): Promise<boolean> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
  const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64");

  const params = new URLSearchParams();
  params.set("To", to);
  params.set("From", TWILIO_NUMBER);
  params.set("Body", body);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  return res.ok;
}

async function getContactsByTag(tag: string): Promise<Array<{
  id: string;
  phone: string;
  firstName: string;
  dateAdded: string;
  tags: string[];
}>> {
  const res = await fetch(`${GHL_BASE}/contacts/search`, {
    method: "POST",
    headers: ghlHeaders,
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      filters: [{ field: "tags", operator: "contains", value: tag }],
      pageLimit: 100,
      page: 1,
    }),
  });

  if (!res.ok) return [];

  const data = (await res.json()) as {
    contacts: Array<{
      id: string;
      phone: string;
      firstName: string;
      dateAdded: string;
      tags: string[];
    }>;
  };

  return data.contacts || [];
}

async function addTag(contactId: string, tag: string): Promise<void> {
  await fetch(`${GHL_BASE}/contacts/${contactId}/tags/`, {
    method: "POST",
    headers: ghlHeaders,
    body: JSON.stringify({ tags: [tag], locationId: GHL_LOCATION_ID }),
  });
}

async function removeTag(contactId: string, tag: string): Promise<void> {
  await fetch(`${GHL_BASE}/contacts/${contactId}/tags/`, {
    method: "DELETE",
    headers: ghlHeaders,
    body: JSON.stringify({ tags: [tag], locationId: GHL_LOCATION_ID }),
  });
}

async function isStillNewLead(contactId: string): Promise<boolean> {
  const res = await fetch(
    `${GHL_BASE}/opportunities/search?location_id=${GHL_LOCATION_ID}&pipeline_id=${GHL_PIPELINE_ID}&status=open&contact_id=${contactId}&limit=1`,
    { headers: ghlHeaders },
  );

  if (!res.ok) return false;

  const data = (await res.json()) as {
    opportunities: Array<{ pipelineStageId: string }>;
  };

  const opp = data.opportunities?.[0];
  if (!opp) return true;

  return opp.pipelineStageId === "18f889b0-398b-4afc-917c-9d9c4c1ce532";
}

export default async function handler() {
  if (!GHL_API_KEY || !TWILIO_SID) {
    return new Response("Not configured", { status: 200 });
  }

  const contacts = await getContactsByTag("followup-pending");
  const now = Date.now();

  for (const contact of contacts) {
    if (!contact.phone) continue;

    const elapsed = now - new Date(contact.dateAdded).getTime();
    const hasSent1 = contact.tags.includes("followup-1-sent");
    const hasSent2 = contact.tags.includes("followup-2-sent");

    if (!hasSent1 && elapsed >= FOLLOWUP_1_DELAY_MS) {
      const stillNew = await isStillNewLead(contact.id);
      if (stillNew) {
        await sendSms(contact.phone, FOLLOWUP_1_MSG);
        await addTag(contact.id, "followup-1-sent");
      } else {
        await removeTag(contact.id, "followup-pending");
      }
    }

    if (hasSent1 && !hasSent2 && elapsed >= FOLLOWUP_2_DELAY_MS) {
      const stillNew = await isStillNewLead(contact.id);
      if (stillNew) {
        await sendSms(contact.phone, FOLLOWUP_2_MSG);
        await addTag(contact.id, "followup-2-sent");
        await removeTag(contact.id, "followup-pending");
      } else {
        await removeTag(contact.id, "followup-pending");
      }
    }

    if (hasSent2) {
      await removeTag(contact.id, "followup-pending");
    }
  }

  return new Response("OK", { status: 200 });
}

export const config: Config = {
  schedule: "*/5 * * * *",
};
