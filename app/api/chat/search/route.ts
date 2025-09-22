import { xai } from "@ai-sdk/xai";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: xai.chat("grok-4-fast-reasoning"),
    messages: convertToModelMessages(messages),
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
  return result.toUIMessageStreamResponse();
}
