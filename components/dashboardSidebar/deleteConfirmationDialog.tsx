import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import ConfirmationDialog from "@/components/shared/confirmationDialog";

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

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <ConfirmationDialog
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive"
          disabled={isDeleting}
          onClick={handleTriggerClick}
        >
          {isDeleting ? <Spinner /> : <Trash2Icon className="w-4 h-4" />}
        </Button>
      }
      title={
        <>
          Delete <span className="text-primary">{target}</span>
        </>
      }
      description="This action cannot be undone."
      actionFunction={deleteFunction}
      actionLabel="Delete"
      actionVariant="destructive"
      isLoading={isDeleting}
      setIsLoading={setIsDeleting}
      onOpenChange={onOpenChange}
      onBeforeOpen={onBeforeOpen}
    />
  );
}
