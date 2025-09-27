"use client";

import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  useSidebar,
} from "@/components/ui/sidebar";
import DeleteConfirmationDialog from "@/components/dashboardSidebar/deleteConfirmationDialog";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteConversationAction } from "@/app/(main)/search/actions";
import { useChatStore } from "@/store/chat";
import { useRef } from "react";

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
  const { isMobile, setOpenMobile } = useSidebar();
  const deleteDialogOpenRef = useRef(false);

  const handleOpen = () => {
    setCurrentConversationId(id);
    router.push(`/search?c=${id}`);

    if (isMobile && !deleteDialogOpenRef.current) {
      setOpenMobile(false);
    }
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

  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={handleOpen} asChild>
        <div className="flex items-center justify-between w-full">
          <span className="truncate">{title}</span>
          <SidebarMenuAction asChild showOnHover>
            <DeleteConfirmationDialog
              deleteFunction={handleDelete}
              target={title || "Conversation"}
              onBeforeOpen={() => {
                deleteDialogOpenRef.current = true;
              }}
              onOpenChange={(open) => {
                deleteDialogOpenRef.current = open;
              }}
            />
          </SidebarMenuAction>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
