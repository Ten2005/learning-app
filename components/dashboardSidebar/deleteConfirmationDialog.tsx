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
import { Trash2Icon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export default function DeleteConfirmationDialog({
  deleteFunction,
  target,
  onOpenChange,
  onBeforeOpen,
}: {
  deleteFunction: () => Promise<void>;
  target: string;
  onOpenChange?: (open: boolean) => void;
  onBeforeOpen?: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteFunction();
    setIsDeleting(false);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBeforeOpen?.();
  };
  return (
    <AlertDialog onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive"
          disabled={isDeleting}
          onClick={handleTriggerClick}
        >
          {isDeleting ? <Spinner /> : <Trash2Icon className="w-4 h-4" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="overflow-x-auto scrollbar-hide">
          <AlertDialogTitle className="overflow-x-auto scrollbar-hide whitespace-nowrap">
            Delete <span className="text-primary">{target}</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Spinner /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
