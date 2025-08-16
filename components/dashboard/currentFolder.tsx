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
import { CheckIcon, Folder, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebarStore } from "@/store/sidebar";
import { useDashboardStore } from "@/store/dashboard";
import {
  deleteFolderAction,
  deleteFileAction,
  updateFolderAction,
} from "@/app/(main)/dashboard/actions";
import { Input } from "../ui/input";
import { UsedFolder } from "@/types/sidebar/folder";

export default function CurrentFolder() {
  const { currentFolder, currentFiles } = useSidebarStore();
  const { setCurrentFile } = useDashboardStore();

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
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center justify-start w-full">
                <Folder className="w-4 h-4 mr-2" />
                {currentFolder.name}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {currentFiles.map((file) => (
                <div
                  className="flex items-center justify-between w-full"
                  key={file.id}
                >
                  <Button
                    key={file.id}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => {
                      setCurrentFile(file);
                    }}
                  >
                    {file.page} : {file.title || "None"}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => {
                      deleteFileAction(file.id);
                    }}
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteFolder}
          className="text-destructive"
        >
          <Trash2Icon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
