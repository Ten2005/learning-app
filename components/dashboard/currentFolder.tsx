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
import { Folder } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebarStore } from "@/store/sidebar";
import { useDashboardStore } from "@/store/dashboard";

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
                <Button
                  key={file.id}
                  variant="ghost"
                  size="sm"
                  className="p-0 justify-start w-full text-muted-foreground"
                  onClick={() => {
                    setCurrentFile(file);
                  }}
                >
                  {file.page} : {file.title || "None"}
                </Button>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
