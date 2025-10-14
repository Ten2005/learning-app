import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2Icon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export default function EditConfirmationDialog({
  editFunction,
  target,
  onOpenChange,
  onBeforeOpen,
}: {
  editFunction: (newTitle: string) => Promise<void>;
  target: string;
  onOpenChange?: (open: boolean) => void;
  onBeforeOpen?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(target);
  const [open, setOpen] = useState(false);

  const handleEdit = async () => {
    setIsEditing(true);
    await editFunction(newTitle);
    setIsEditing(false);
    setOpen(false);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNewTitle(target);
    onBeforeOpen?.();
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    onOpenChange?.(isOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isEditing}
          onClick={handleTriggerClick}
        >
          {isEditing ? <Spinner /> : <Edit2Icon className="w-4 h-4" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="overflow-x-auto scrollbar-hide">
          <AlertDialogTitle className="overflow-x-auto scrollbar-hide whitespace-nowrap">
            Edit <span className="text-primary">{target}</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action will overwrite the current content.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Input
              id="title-input"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleEdit} disabled={isEditing}>
            {isEditing ? <Spinner /> : "Edit"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
