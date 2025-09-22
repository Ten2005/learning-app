import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";

import { ModeToggle } from "../modeToggle";
import { readConversationsAction } from "@/app/(main)/search/actions";
import ConversationItem from "@/components/searchSidebar/conversationItem";
import { Button } from "../ui/button";
import Link from "next/link";

export async function SearchSidebar() {
  const conversations = await readConversationsAction();
  return (
    <Sidebar>
      <SidebarHeader>
        <ModeToggle />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="flex flex-row items-center py-2">
              <Button variant="secondary" size="sm" asChild>
                <Link href="/dashboard" prefetch>
                  dashboard
                </Link>
              </Button>
            </div>
            <SidebarMenu>
              {conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  id={conversation.id}
                  title={conversation.title}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
