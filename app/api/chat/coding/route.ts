import { xai } from "@ai-sdk/xai";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: xai.chat("grok-code-fast-1"),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
