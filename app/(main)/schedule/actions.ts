"use server";

import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/lib/auth/user";

export async function getOrCreateScheduleFile(date: string) {
  const supabase = await createClient();
  const user = await getUser();

  // 既存のファイルを検索
  const { data: existingFile, error: fetchError } = await supabase
    .from("file")
    .select("id, title, content")
    .eq("user_id", user.id)
    .eq("title", date)
    .eq("is_deleted", false)
    .maybeSingle();

  if (fetchError) {
    console.error(fetchError);
    throw new Error("Failed to fetch schedule file");
  }

  // 既存のファイルがあればそれを返す
  if (existingFile) {
    return existingFile;
  }

  // なければ新規作成
  const { data: newFile, error: createError } = await supabase
    .from("file")
    .insert({
      user_id: user.id,
      title: date,
      content: "",
      parent_id: null,
      page: 0,
    })
    .select("id, title, content")
    .single();

  if (createError) {
    console.error(createError);
    throw new Error("Failed to create schedule file");
  }

  return newFile;
}

export async function updateScheduleFile(
  id: number,
  title: string,
  content: string,
) {
  const supabase = await createClient();
  const user = await getUser();

  const { data, error } = await supabase
    .from("file")
    .update({ title, content })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to update schedule file");
  }

  return data;
}
