"use client";

import {
  SidebarMenuAction,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "../ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { CheckIcon, Folder, PencilIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebarStore } from "@/store/sidebar";
import { useDashboardStore } from "@/store/dashboard";
import { useRouter } from "next/navigation";
import {
  deleteFolderAction,
  deleteFileAction,
  updateFolderAction,
  createFileAction,
  readFoldersAction,
} from "@/app/(main)/dashboard/actions";
import { Input } from "../ui/input";
import { UsedFolder } from "@/store/sidebar";
import DeleteConfirmationDialog from "./deleteConfirmationDialog";
import CreatePageButton from "./createPageButton";

export default function CurrentFolder() {
  const { currentFolder, currentFiles, setCurrentFiles } = useSidebarStore();
  const { currentFile, setCurrentFile } = useDashboardStore();

  const handleDeleteFile = async (fileId: number) => {
    if (!currentFolder) return;

    const fileToDelete = currentFiles.find((file) => file.id === fileId);
    if (!fileToDelete) return;

    await deleteFileAction(fileId, currentFolder.id, fileToDelete.page);

    const filteredFiles = currentFiles
      .filter((file) => file.id !== fileId)
      .map((file) => ({
        ...file,
        page: file.page > fileToDelete.page ? file.page - 1 : file.page,
      }))
      .sort((a, b) => a.page - b.page);

    setCurrentFiles(filteredFiles);

    if (filteredFiles.length === 0 && currentFolder) {
      const file = await createFileAction(currentFolder.id, 0);
      setCurrentFiles([file]);
      setCurrentFile(file);
    } else {
      const updatedCurrent =
        currentFile?.id === fileId
          ? filteredFiles[0]
          : filteredFiles.find((file) => file.id === currentFile?.id);
      if (updatedCurrent) setCurrentFile(updatedCurrent);
    }
  };

  if (!currentFolder)
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Current Folder</SidebarGroupLabel>
        <SidebarGroupContent>
          <p className="text-sm text-muted-foreground">
            Select a folder below to get started.
          </p>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Current Folder</SidebarGroupLabel>
      <SidebarGroupContent>
        <EditFolder currentFolder={currentFolder} />
        <Accordion type="single" defaultValue="item-1" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center justify-start w-full">
                <Folder className="w-4 h-4 mr-2" />
                {currentFolder.name}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {currentFiles.map((file) => (
                <SidebarMenuButton
                  key={file.id}
                  onClick={() => {
                    setCurrentFile(file);
                  }}
                  asChild
                >
                  <div className="flex items-center justify-between w-full">
                    <span>
                      {file.page} :{" "}
                      {file.title
                        ? file.title.length > 10
                          ? file.title.slice(0, 10) + "..."
                          : file.title
                        : "None"}
                    </span>
                    <SidebarMenuAction
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      asChild
                      showOnHover
                    >
                      <DeleteConfirmationDialog
                        deleteFunction={() => handleDeleteFile(file.id)}
                        target={file.title || "None"}
                      />
                    </SidebarMenuAction>
                  </div>
                </SidebarMenuButton>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex justify-end">
          <CreatePageButton />
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function EditFolder({ currentFolder }: { currentFolder: UsedFolder }) {
  const {
    isEditingFolder,
    setIsEditingFolder,
    setCurrentFolder,
    setCurrentFiles,
    cacheFiles,
  } = useSidebarStore();
  const { setCurrentFile } = useDashboardStore();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFolder({ ...currentFolder, name: e.target.value });
  };

  const handleUpdateFolder = () => {
    if (isEditingFolder) {
      updateFolderAction(currentFolder.id, currentFolder.name);
    }
    setIsEditingFolder(!isEditingFolder);
  };

  const handleDeleteFolder = async () => {
    await deleteFolderAction(currentFolder.id);

    const folders = await readFoldersAction();
    if (folders.length > 0) {
      const first = folders[0];
      setCurrentFolder(first);
      cacheFiles(first.id, first.files);
      setCurrentFiles(first.files);
      setCurrentFile(first.files[0] ?? undefined);
    } else {
      setCurrentFolder(undefined);
      setCurrentFiles([]);
      setCurrentFile(undefined);
    }

    router.refresh();
  };

  return (
    <div className="flex items-center justify-between w-full gap-4">
      {isEditingFolder ? (
        <Input
          type="text"
          value={currentFolder.name}
          onChange={handleInputChange}
        />
      ) : (
        <p>{currentFolder.name}</p>
      )}
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={handleUpdateFolder}>
          {isEditingFolder ? (
            <CheckIcon className="w-4 h-4" />
          ) : (
            <PencilIcon className="w-4 h-4" />
          )}
        </Button>
        <DeleteConfirmationDialog
          deleteFunction={handleDeleteFolder}
          target={currentFolder.name}
        />
      </div>
    </div>
  );
}
