import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

import NewFolderDialog from "./newFolderDialog";
import { readFoldersAction } from "@/app/(main)/dashboard/actions";
import Folders from "./folders";
import CurrentFolder from "./currentFolder";

export async function DashboardSidebar() {
  const folders = await readFoldersAction();
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
