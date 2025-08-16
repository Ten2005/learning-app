import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

import NewFolderDialog from "./newFolderDialog";
import { getFoldersAction } from "@/app/(main)/dashboard/actions";
import Folders from "./folders";
import CurrentFolder from "./currentFolder";

export async function DashboardSidebar() {
  const folders = await getFoldersAction();
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
