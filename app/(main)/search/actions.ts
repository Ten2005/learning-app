"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  createConversation,
  addMessage,
  readMessages,
  readConversations,
  deleteConversation,
} from "@/lib/db/chat";

export async function saveMessageAction(
  conversation_id: number | null,
  message: string,
  role: string,
) {
  if (!conversation_id) {
    const conversation = await createConversation(message);
    conversation_id = conversation.id as number;
  }
  const insertedMessage = await addMessage(conversation_id, message, role);
  revalidatePath("/search");
  revalidateTag("messages");
  return insertedMessage.conversation_id as number;
}

export async function readMessagesAction(conversation_id: number) {
  const messages = await readMessages(conversation_id);
  return messages;
}

export async function readConversationsAction() {
  const conversations = await readConversations();
  return conversations;
}

export async function deleteConversationAction(conversation_id: number) {
  await deleteConversation(conversation_id);
  revalidatePath("/search");
  revalidateTag("messages");
}
