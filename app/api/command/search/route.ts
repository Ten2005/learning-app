import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";
import { removeMarkdown } from "@/utils/removeMarkdown";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  try {
    const { text } = await generateText({
      model: xai.chat("grok-4-fast-reasoning"),
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
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
    const strippedText = await removeMarkdown(text);
    return NextResponse.json({ text: strippedText });
  } catch (error) {
    console.error("command search route failed", error);
    return NextResponse.json(
      { error: "command search failed" },
      { status: 500 },
    );
  }
}
