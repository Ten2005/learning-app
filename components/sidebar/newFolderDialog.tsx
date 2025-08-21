"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useSidebarStore } from "@/store/sidebar";
import { createFolderAction } from "@/app/(main)/dashboard/actions";

export default function NewFolderDialog() {
  const {
    newFolderName,
    setNewFolderName,
    isDialogOpen,
    setIsDialogOpen,
    isCreatingFolder,
    setIsCreatingFolder,
  } = useSidebarStore();

  const handleCreateFolder = async () => {
    if (newFolderName === "") return;
    await setIsCreatingFolder(true);
    await createFolderAction(newFolderName);
    setNewFolderName("");
    setIsDialogOpen(false);
    setIsCreatingFolder(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          New Folder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>
            Please enter the name of the new folder.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <DialogFooter>
          <Button
            type="submit"
            size="sm"
            disabled={newFolderName === "" || !isDialogOpen || isCreatingFolder}
            onClick={handleCreateFolder}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
