import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { getOrCreateConversation, createMessage } from "@/lib/db/chat";

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

  const firstUserText = messages[0]?.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  const conversation = await getOrCreateConversation(
    conversationId,
    title ?? firstUserText,
  );

  const userMessage = messages[messages.length - 1];
  const userText = userMessage.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
  await createMessage(conversation.id, userMessage.role, userText);

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
