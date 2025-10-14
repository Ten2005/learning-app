import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { useChatStore } from "@/store/chat";
import ConfirmationDialog from "@/components/shared/confirmationDialog";

export default function AddConfirmationDialog({
  addFunction,
}: {
  addFunction: () => Promise<void>;
}) {
  const { isAdding, setIsAdding } = useChatStore();

  return (
    <ConfirmationDialog
      trigger={
        <Button variant="ghost" size="icon" asChild>
          <CopyIcon className="w-4 h-4" />
        </Button>
      }
      title="Add Message"
      description="Add a message to the current page."
      actionFunction={addFunction}
      actionLabel="Add"
      isLoading={isAdding}
      setIsLoading={setIsAdding}
    />
  );
}
