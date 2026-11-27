import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function fail(msg: string, status = 400) {
  return NextResponse.json({ success: false, error: msg }, { status });
}

export async function POST(request: NextRequest) {
  if (!OPENAI_API_KEY) {
    return fail("Transcription not configured", 500);
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return fail("No audio file provided");
    }

    const whisperForm = new FormData();
    whisperForm.append("file", audioFile, "audio.webm");
    whisperForm.append("model", "whisper-1");
    whisperForm.append("language", "en");

    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: whisperForm,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Whisper API error:", err);
      return fail("Transcription failed", 500);
    }

    const data = await res.json();
    return NextResponse.json({ success: true, text: data.text });
  } catch (e) {
    console.error("Transcribe error:", e);
    return fail("Transcription failed", 500);
  }
}
