"use client";

import { UsedFolder } from "@/types/sidebar/folder";
import { Button } from "../ui/button";
import { Folder } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "../ui/sidebar";
import { useSidebarStore } from "@/store/sidebar";

export default function Folders({ folders }: { folders: UsedFolder[] }) {
  const { setCurrentFolder } = useSidebarStore();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Folders</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        {folders.map((folder) => (
          <Button
            key={folder.id}
            variant="ghost"
            size="sm"
            className="p-0 justify-start w-full"
            onClick={() => {
              setCurrentFolder(folder);
            }}
          >
            <div
              id={folder.id.toString()}
              className="flex items-center justify-start w-full"
            >
              <Folder className="w-4 h-4 mr-2" />
              {folder.name}
            </div>
          </Button>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
