import { createClient } from "@/utils/supabase/server";
import { getUser } from "../auth/user";

export async function getFolders() {
  const supabase = await createClient();
  const user = await getUser();
  const { data, error } = await supabase
    .from("folder")
    .select("*")
    .eq("user_id", user.id)
    .eq("deleted_at", null);
  if (error) {
    console.error(error);
    throw new Error("Failed to get folders");
  }
  return data;
}

export async function createFolder(name: string) {
  const supabase = await createClient();
  const user = await getUser();
  const { data, error } = await supabase
    .from("folder")
    .insert({ name, user_id: user.id })
    .select()
    .single();
  if (error) {
    console.error(error);
    throw new Error("Failed to create folder");
  }
  return data;
}
