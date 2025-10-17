import { anthropic } from "@ai-sdk/anthropic";
import { streamText, UIMessage, convertToModelMessages, Tool } from "ai";
import { addMessage } from "@/lib/db/chat";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: Request) {
  const {
    messages,
    conversationId,
  }: { messages: UIMessage[]; conversationId: number | null } =
    await req.json();

  const webSearchTool = anthropic.tools.webSearch_20250305({
    maxUses: 5,
  }) as unknown as Tool;

  const result = streamText({
    model: anthropic.chat("claude-sonnet-4-5"),
    messages: convertToModelMessages(messages),
    tools: {
      web_search: webSearchTool,
    },
    onFinish: async ({ text }) => {
      // サーバー側でアシスタントメッセージを保存
      if (conversationId && text) {
        try {
          await addMessage(conversationId, text, "assistant");
          revalidatePath("/search");
          revalidateTag("messages");
        } catch (error) {
          console.error("Failed to save assistant message on server:", error);
        }
      }
    },
  });
  return result.toUIMessageStreamResponse();
}
