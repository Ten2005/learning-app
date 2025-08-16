"use client";

import { useSidebarStore } from "@/store/sidebar";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";

export default function CreatePageButton() {
    const { currentFolder } = useSidebarStore();
    if (!currentFolder) return;
    return (
      <div>
        <Button size="sm">
          <PlusIcon />
          New Page
        </Button>
      </div>
    );
  }