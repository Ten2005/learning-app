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
import { Loader2Icon, PlusIcon } from "lucide-react";
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
        <Button size="sm" disabled={isCreatingFolder}>
          {isCreatingFolder ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusIcon />
          )}
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
            {isCreatingFolder ? (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
