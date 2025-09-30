import type { UIMessage } from "ai";
import type { DbMessage } from "@/lib/db/chat";

type TextPart = Extract<UIMessage["parts"][number], { type: "text" }>;

export function isTextPart(part: UIMessage["parts"][number]): part is TextPart {
  return part.type === "text";
}

export function extractMessageText(message: UIMessage): string {
  return (message.parts ?? [])
    .map((part) => (isTextPart(part) ? part.text : ""))
    .join("");
}

export function dbMessageToUIMessage(dbMessage: DbMessage): UIMessage {
  return {
    id: String(dbMessage.id),
    role: dbMessage.role,
    parts: [{ type: "text", text: dbMessage.content }],
  };
}
