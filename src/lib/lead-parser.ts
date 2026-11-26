const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

const SYSTEM_PROMPT = `You extract lead information from voicemail transcripts left at a carpentry/construction business.

Extract:
- name: The caller's name. If not stated, return "Unknown Caller".
- need: A brief summary of what they need done (e.g., "deck repair", "kitchen remodel", "fence installation"). If unclear, return "General inquiry".
- phone: A phone number if they state one in the message. If not stated, return empty string.
- urgency: "high" if they mention emergency, water damage, urgent, ASAP, or similar. Otherwise "normal".

Return ONLY valid JSON:
{"name": "...", "need": "...", "phone": "...", "urgency": "..."}`;

export interface ParsedLead {
  name: string;
  need: string;
  phone: string;
  urgency: "high" | "normal";
}

export async function parseLeadTranscript(
  transcript: string,
): Promise<ParsedLead> {
  const fallback: ParsedLead = {
    name: "Unknown Caller",
    need: "General inquiry",
    phone: "",
    urgency: "normal",
  };

  if (!ANTHROPIC_API_KEY) return fallback;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 256,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: transcript }],
      }),
    });

    if (!res.ok) return fallback;

    const data = (await res.json()) as {
      content: Array<{ type: string; text: string }>;
    };
    const text = data.content?.[0]?.text || "";
    const parsed = JSON.parse(text) as ParsedLead;

    return {
      name: parsed.name || fallback.name,
      need: parsed.need || fallback.need,
      phone: parsed.phone || "",
      urgency: parsed.urgency === "high" ? "high" : "normal",
    };
  } catch {
    return fallback;
  }
}
