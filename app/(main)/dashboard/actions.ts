"use server";

import { createFolder } from "@/lib/db/folder";
import { revalidatePath } from "next/cache";

export async function createFolderAction(name: string) {
  try {
    const folder = await createFolder(name);
    revalidatePath("/dashboard");
    return folder;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw new Error("Failed to create folder");
  }
}
