"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
import {
  deleteFolderAction,
  deleteFileAction,
  updateFolderAction,
  createFileAction,
} from "@/app/(main)/dashboard/actions";
import { Input } from "../ui/input";
import { UsedFolder } from "@/store/sidebar";
import DeleteConfirmationDialog from "./deleteConfirmationDialog";
import CreatePageButton from "./createPageButton";

export default function CurrentFolder() {
  const { currentFolder, currentFiles, setCurrentFiles, setIsDeleting } =
    useSidebarStore();
  const { currentFile, setCurrentFile } = useDashboardStore();

  const handleDeleteFile = async (fileId: number) => {
    if (!currentFolder) return;

    const fileToDelete = currentFiles.find((file) => file.id === fileId);
    if (!fileToDelete) return;

    setIsDeleting(true);
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
    setIsDeleting(false);
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
                <Button
                  key={file.id}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground p-0 justify-between w-full"
                  onClick={() => {
                    setCurrentFile(file);
                  }}
                  asChild
                >
                  <div>
                    <span>
                      {file.page} :{" "}
                      {file.title
                        ? file.title.length > 7
                          ? file.title.slice(0, 7) + "..."
                          : file.title
                        : "None"}
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <DeleteConfirmationDialog
                        deleteFunction={() => handleDeleteFile(file.id)}
                        target={file.title || "None"}
                      />
                    </span>
                  </div>
                </Button>
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
  const { isEditingFolder, setIsEditingFolder, setCurrentFolder } =
    useSidebarStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFolder({ ...currentFolder, name: e.target.value });
  };

  const handleUpdateFolder = () => {
    if (isEditingFolder) {
      updateFolderAction(currentFolder.id, currentFolder.name);
    }
    setIsEditingFolder(!isEditingFolder);
  };

  const handleDeleteFolder = () => {
    deleteFolderAction(currentFolder.id);
    setCurrentFolder(undefined);
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
