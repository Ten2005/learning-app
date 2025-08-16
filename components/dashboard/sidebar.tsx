import { Folder } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import NewFolderDialog from "./newFolderDialog";

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <NewFolderDialog />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function CurrentFolder() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Current Folder</SidebarGroupLabel>
      <SidebarGroupContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center justify-start w-full">
                <Folder className="w-4 h-4 mr-2" />
                Item 1
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {Array.from({ length: 10 }, (_, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  className="p-0 justify-start w-full"
                >
                  Item {i + 1}
                </Button>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function Folders() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Folders</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        {Array.from({ length: 10 }, (_, i) => (
          <Button
            key={i}
            variant="ghost"
            size="sm"
            className="p-0 justify-start w-full"
          >
            <div className="flex items-center justify-start w-full">
              <Folder className="w-4 h-4 mr-2" />
              Item {i + 1}
            </div>
          </Button>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
