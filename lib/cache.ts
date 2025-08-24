import { unstable_cache } from "next/cache";
import { readFolders } from "@/lib/db/folder";
import { readFiles as readFilesByParent } from "@/lib/db/file";

export const getCachedFolders = unstable_cache(
  async () => {
    return await readFolders();
  },
  ["folders"],
  {
    tags: ["folders"],
    revalidate: 60,
  },
);

export const getCachedFilesByFolder = unstable_cache(
  async (parentId: number) => {
    return await readFilesByParent(parentId);
  },
  ["files"],
  {
    tags: ["files"],
    revalidate: 30,
  },
);

export function revalidateFoldersCache() {
  // This will be used to invalidate cache when folders are modified
  return { tag: "folders" };
}

export function revalidateFilesCache() {
  // This will be used to invalidate cache when files are modified
  return { tag: "files" };
}
