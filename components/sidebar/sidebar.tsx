import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

import NewFolderDialog from "./newFolderDialog";
import { readFoldersAction } from "@/app/(main)/dashboard/actions";
import Folders from "@/components/sidebar/folders";
import CurrentFolder from "@/components/sidebar/currentFolder";
import { ModeToggle } from "../modeToggle";

export async function DashboardSidebar() {
  const folders = await readFoldersAction();
  return (
    <Sidebar>
      <div className="flex justify-start p-1">
        <ModeToggle />
      </div>
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
