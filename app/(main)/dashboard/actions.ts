"use server";

import { createFolder, getFolders } from "@/lib/db/folder";
import { createFile, getFiles } from "@/lib/db/file";
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

export async function createFileAction(parent_id: number, page: number) {
  try {
    const file = await createFile(parent_id, page);
    revalidatePath("/dashboard");
    return file;
  } catch (error) {
    console.error("Error creating file:", error);
    throw new Error("Failed to create file");
  }
}

export async function getFilesAction(parent_id: number) {
  try {
    const files = await getFiles(parent_id);
    return files;
  } catch (error) {
    console.error("Error getting files:", error);
    throw new Error("Failed to get files");
  }
}
