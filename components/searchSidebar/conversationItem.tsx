"use client";

import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  useSidebar,
} from "@/components/ui/sidebar";
import DeleteConfirmationDialog from "@/components/dashboardSidebar/deleteConfirmationDialog";
import EditConfirmationDialog from "@/components/dashboardSidebar/editConfirmationDialog";
import { useRouter, useSearchParams } from "next/navigation";
import {
  deleteConversationAction,
  updateConversationAction,
} from "@/app/(main)/search/actions";
import { useChatStore } from "@/store/chat";
import { useRef } from "react";
import { cn } from "@/lib/utils";

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
  const editDialogOpenRef = useRef(false);

  const handleOpen = () => {
    setCurrentConversationId(id);
    router.push(`/search?c=${id}`);

    if (
      isMobile &&
      !deleteDialogOpenRef.current &&
      !editDialogOpenRef.current
    ) {
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

  const handleEdit = async (newTitle: string) => {
    await updateConversationAction(newTitle, id);
    router.refresh();
  };

  const isSelected = currentConversationId === id;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={handleOpen}
        className={cn(isSelected && "bg-accent")}
        asChild
      >
        <div className="flex items-center w-full">
          <span className="truncate flex-1 min-w-0">{title}</span>
          <div className="flex items-center flex-shrink-0">
            <SidebarMenuAction asChild showOnHover>
              <EditConfirmationDialog
                editFunction={handleEdit}
                target={title || "Conversation"}
                onBeforeOpen={() => {
                  editDialogOpenRef.current = true;
                }}
                onOpenChange={(open) => {
                  editDialogOpenRef.current = open;
                }}
              />
            </SidebarMenuAction>
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
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
