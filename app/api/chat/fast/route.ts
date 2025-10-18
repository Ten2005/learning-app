import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages, ToolSet } from "ai";
import { addMessage } from "@/lib/db/chat";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: Request) {
  const {
    messages,
    conversationId,
  }: { messages: UIMessage[]; conversationId: number | null } =
    await req.json();

  const tools = {
    google_search: google.tools.googleSearch({}),
  } as unknown as ToolSet;

  const result = streamText({
    model: google.chat("gemini-2.5-flash"),
    tools,
    messages: convertToModelMessages(messages),
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
