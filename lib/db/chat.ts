import { createClient } from "@/utils/supabase/server";
import { getUser } from "../auth/user";

interface Conversation {
  id: number;
  title: string | null;
}

export async function getOrCreateConversation(
  id?: number,
  title?: string,
): Promise<Conversation> {
  const supabase = await createClient();
  const user = await getUser();

  if (id) {
    const { data, error } = await supabase
      .from("conversations")
      .select("id, title")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    if (!error && data) {
      return data as Conversation;
    }
  }

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: user.id, title })
    .select("id, title")
    .single();
  if (error || !data) {
    console.error(error);
    throw new Error("Failed to create conversation");
  }
  return data as Conversation;
}

export async function createMessage(
  conversationId: number,
  role: string,
  content: string,
) {
  const supabase = await createClient();
  const user = await getUser();
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    user_id: user.id,
    role,
    content,
  });
  if (error) {
    console.error(error);
    throw new Error("Failed to create message");
  }
}
