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
import { CopyIcon } from "lucide-react";
import { useChatStore } from "@/store/chat";

export default function AddConfirmationDialog({
  addFunction,
}: {
  addFunction: () => Promise<void>;
}) {
  const { isAdding, setIsAdding } = useChatStore();

  const handleAdd = async () => {
    setIsAdding(true);
    await addFunction();
    setIsAdding(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" asChild>
          <CopyIcon className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Message</AlertDialogTitle>
          <AlertDialogDescription>
            Add a message to the current page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAdd} disabled={isAdding}>
            Add
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
