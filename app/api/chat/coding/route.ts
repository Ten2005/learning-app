import { xai } from "@ai-sdk/xai";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { addMessage } from "@/lib/db/chat";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: Request) {
  const {
    messages,
    conversationId,
  }: { messages: UIMessage[]; conversationId: number | null } =
    await req.json();

  const result = streamText({
    model: xai.chat("grok-code-fast-1"),
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
