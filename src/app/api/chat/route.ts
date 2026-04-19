import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are HiveAI, the expert hunting assistant for HuntHive — a platform connecting hunters with outfitters and gear.

You specialize in:
- Hunting gear recommendations (rifles, bows, optics, clothing, boots, accessories)
- Species-specific hunting advice (elk, deer, moose, bear, turkey, hogs, waterfowl, etc.)
- Hunting locations and best seasons across North America
- Outfitter selection guidance
- Licensing and regulations overview (advise checking local regulations for specifics)
- Shot placement, field dressing, and meat care
- Hunting tactics and strategies

Be conversational, knowledgeable, and enthusiastic about hunting. Keep responses concise but packed with useful info. Use bullet points for lists. Always recommend safety first.

When recommending gear, consider budget, experience level, and hunting style. When discussing locations, consider game populations, public vs private land, license availability, and difficulty level.

Start messages with a brief direct answer, then expand if needed. Never be overly verbose.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Add OPENAI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return NextResponse.json({ content });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
