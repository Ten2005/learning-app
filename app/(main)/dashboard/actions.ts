"use server";

import {
  createFolder,
  readFolders,
  updateFolder,
  deleteFolder,
} from "@/lib/db/folder";
import {
  createFile,
  deleteFile,
  readFiles,
  updateFile,
  incrementFilePages,
  renumberFilePages,
} from "@/lib/db/file";
import { revalidatePath, revalidateTag } from "next/cache";
export async function createFolderAction(name: string) {
  try {
    const folder = await createFolder(name);
    revalidatePath("/dashboard");
    revalidateTag("folders");
    return folder;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw new Error("Failed to create folder");
  }
}

export async function readFoldersAction() {
  try {
    const folders = await readFolders();
    const foldersWithFiles = await Promise.all(
      folders.map(async (folder) => ({
        ...folder,
        files: await readFiles(folder.id),
      })),
    );
    return foldersWithFiles;
  } catch (error) {
    console.error("Error getting folders:", error);
    throw new Error("Failed to get folders");
  }
}

export async function updateFolderAction(id: number, name: string) {
  try {
    const folder = await updateFolder(id, name);
    revalidatePath("/dashboard");
    revalidateTag("folders");
    return folder;
  } catch (error) {
    console.error("Error updating folder:", error);
    throw new Error("Failed to update folder");
  }
}

export async function deleteFolderAction(id: number) {
  try {
    const folder = await deleteFolder(id);
    revalidatePath("/dashboard");
    revalidateTag("folders");
    revalidateTag("files");
    return folder;
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw new Error("Failed to delete folder");
  }
}

export async function createFileAction(parent_id: number, page: number) {
  try {
    const file = await createFile(parent_id, page);
    revalidatePath("/dashboard");
    revalidateTag("files");
    return file;
  } catch (error) {
    console.error("Error creating file:", error);
    throw new Error("Failed to create file");
  }
}

export async function createFileAfterCurrentAction(
  parent_id: number,
  currentPage: number,
) {
  try {
    await incrementFilePages(parent_id, currentPage + 1);

    const file = await createFile(parent_id, currentPage + 1);
    revalidatePath("/dashboard");
    revalidateTag("files");
    return file;
  } catch (error) {
    console.error("Error in createFileAfterCurrentAction:", error);
    throw new Error("Failed to create file after current");
  }
}

export async function readFilesAction(parent_id: number) {
  try {
    const files = await readFiles(parent_id);
    return files;
  } catch (error) {
    console.error("Error getting files:", error);
    throw new Error("Failed to get files");
  }
}

export async function updateFileAction(
  id: number,
  title: string,
  content: string,
) {
  try {
    const file = await updateFile(id, title, content);
    revalidatePath("/dashboard");
    revalidateTag("files");
    return file;
  } catch (error) {
    console.error("Error updating file:", error);
    throw new Error("Failed to update file");
  }
}

export async function deleteFileAction(
  id: number,
  parent_id: number,
  page: number,
) {
  try {
    const file = await deleteFile(id);
    await renumberFilePages(parent_id, page);
    revalidatePath("/dashboard");
    revalidateTag("files");
    return file;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
}
