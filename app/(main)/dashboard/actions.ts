"use server";

import { createFolder, getFolders } from "@/lib/db/folder";
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

export async function getFoldersAction() {
  try {
    const folders = await getFolders();
    return folders;
  } catch (error) {
    console.error("Error getting folders:", error);
    throw new Error("Failed to get folders");
  }
}
