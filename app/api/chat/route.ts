import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { getOrCreateConversation, createMessage } from "@/lib/db/chat";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    model,
    conversationId,
    title,
  }: {
    messages: UIMessage[];
    model?: string;
    conversationId?: number;
    title?: string;
  } = await req.json();

  const conversation = await getOrCreateConversation(
    conversationId,
    title ?? messages[0]?.content,
  );

  const userMessage = messages[messages.length - 1];
  await createMessage(conversation.id, userMessage.role, userMessage.content);

  const result = streamText({
    model: openai(model ?? "gpt-5-nano"),
    messages: convertToModelMessages(messages),
    tools: {
      web_search_preview: openai.tools.webSearchPreview({
        searchContextSize: "high",
      }),
    },
    onFinish: async ({ text }) => {
      await createMessage(conversation.id, "assistant", text);
    },
  });

  return result.toUIMessageStreamResponse({
    messageMetadata: () => ({ conversationId: conversation.id }),
    sendStart: true,
    sendFinish: true,
  });
}
