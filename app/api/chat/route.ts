import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  const { messages, model }: { messages: UIMessage[]; model?: string } =
    await req.json();

  const result = streamText({
    model: openai(model ?? "gpt-5-nano"),
    messages: convertToModelMessages(messages),
    tools: {
      web_search_preview: openai.tools.webSearchPreview({
        searchContextSize: "high",
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
