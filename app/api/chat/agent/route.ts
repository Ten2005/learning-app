import { NextResponse } from "next/server";
import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  try {
    const { text } = await generateText({
      model: xai.chat("grok-4-fast-reasoning"),
      prompt,
      providerOptions: {
        xai: {
          searchParameters: {
            mode: "on", // 'auto', 'on', or 'off'
            returnCitations: true,
            maxSearchResults: 5,
          },
        },
      },
    });

    return NextResponse.json({ text });
  } catch (error) {
    console.error("agent route failed", error);
    return NextResponse.json({ error: "agent failed" }, { status: 500 });
  }
}
