import { createClient } from "@/utils/supabase/server";
import { getUser } from "../auth/user";

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

export async function readFolders() {
  const supabase = await createClient();
  const user = await getUser();
  const { data, error } = await supabase
    .from("folder")
    .select("id, name")
    .eq("user_id", user.id)
    .eq("is_deleted", false);
  if (error) {
    console.error(error);
    throw new Error("Failed to get folders");
  }
  return data;
}

export async function updateFolder(id: number, name: string) {
  const supabase = await createClient();
  const user = await getUser();
  const { data, error } = await supabase
    .from("folder")
    .update({ name })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) {
    console.error(error);
    throw new Error("Failed to update folder");
  }
  return data;
}

export async function deleteFolder(id: number) {
  const supabase = await createClient();
  const user = await getUser();
  const { data, error } = await supabase
    .from("folder")
    .update({ is_deleted: true })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) {
    console.error(error);
    throw new Error("Failed to delete folder");
  }
  return data;
}
