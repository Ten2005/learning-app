import { Folder, Plus } from "lucide-react";

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

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
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
        <SidebarGroup>
          <SidebarGroupContent>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
