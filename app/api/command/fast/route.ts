import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText, ToolSet } from "ai";
import { removeMarkdown } from "@/utils/removeMarkdown";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const tools = {
    google_search: google.tools.googleSearch({}),
  } as unknown as ToolSet;

  try {
    const { text } = await generateText({
      model: google.chat("gemini-2.5-flash-lite"),
      tools,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const strippedText = await removeMarkdown(text);
    return NextResponse.json({ text: strippedText });
  } catch (error) {
    console.error("command fast route failed", error);
    return NextResponse.json({ error: "command fast failed" }, { status: 500 });
  }
}
