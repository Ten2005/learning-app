"use server";

import { createClient } from "@/utils/supabase/server";

export async function signup(email: string, password: string) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email,
    password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error(error);
  }

  return { error };
}
