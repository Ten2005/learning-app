"use client";

import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import DeleteConfirmationDialog from "@/components/dashboardSidebar/deleteConfirmationDialog";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteConversationAction } from "@/app/(main)/search/actions";
import { useChatStore } from "@/store/chat";

export default function ConversationItem({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCurrentConversationId, currentConversationId } = useChatStore();
  const handleOpen = () => {
    setCurrentConversationId(id);
    router.push(`/search?c=${id}`);
  };

  const handleDelete = async () => {
    await deleteConversationAction(id);
    const currentId = searchParams.get("c");
    if (
      (currentId && Number(currentId) === id) ||
      currentConversationId === id
    ) {
      setCurrentConversationId(null);
      router.replace("/search");
    }
    router.refresh();
  };

  const displayTitle =
    title.length > 10 ? `${title.substring(0, 10)}...` : title;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={handleOpen} asChild>
        <div className="flex items-center justify-between w-full">
          <span className="truncate">{displayTitle}</span>
          <SidebarMenuAction asChild showOnHover>
            <DeleteConfirmationDialog
              deleteFunction={handleDelete}
              target={title || "Conversation"}
            />
          </SidebarMenuAction>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
