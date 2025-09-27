import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import NewFolderDialog from "./newFolderDialog";
import { readFoldersAction } from "@/app/(main)/dashboard/actions";
import Folders from "@/components/dashboardSidebar/folders";
import CurrentFolder from "@/components/dashboardSidebar/currentFolder";
import { ModeToggle } from "../modeToggle";
import { Button } from "../ui/button";
import Link from "next/link";

export async function DashboardSidebar() {
  const folders = await readFoldersAction();
  return (
    <Sidebar>
      <SidebarHeader>
        <ModeToggle />
      </SidebarHeader>
      <SidebarContent>
        <div className="flex flex-row px-2 items-center">
          <Button variant="secondary" size="sm" asChild>
            <Link href="/search" prefetch>
              search
            </Link>
          </Button>
        </div>
        <Folders folders={folders} />
        <CurrentFolder />
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="flex justify-end">
              <NewFolderDialog />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
