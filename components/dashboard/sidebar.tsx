import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

import NewFolderDialog from "./newFolderDialog";
import { getFoldersAction } from "@/app/(main)/dashboard/actions";
import { UsedFolder } from "@/types/sidebar/folder";
import { use } from "react";
import Folders from "./folders";
import CurrentFolder from "./currentFolder";

export function DashboardSidebar() {
  const folders = use(getFoldersAction()) as UsedFolder[];
  return (
    <Sidebar>
      <SidebarContent>
        <CurrentFolder />
        <Folders folders={folders} />
        <SidebarGroup>
          <SidebarGroupContent>
            <NewFolderDialog />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
