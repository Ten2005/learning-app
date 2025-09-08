import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

import { ModeToggle } from "../modeToggle";
import { Button } from "../ui/button";
import Link from "next/link";

export async function SearchSidebar() {
  return (
    <Sidebar>
      <div className="flex justify-between p-1">
        <ModeToggle />
        <Button variant="link" asChild>
          <Link href="/dashboard">dashboard</Link>
        </Button>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent></SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
