import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2Icon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import ConfirmationDialog from "@/components/shared/confirmationDialog";

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

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNewTitle(target);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    onOpenChange?.(isOpen);
  };

  const handleBeforeOpen = () => {
    setNewTitle(target);
    onBeforeOpen?.();
  };

  return (
    <ConfirmationDialog
      trigger={
        <Button
          variant="ghost"
          size="icon"
          disabled={isEditing}
          onClick={handleTriggerClick}
        >
          {isEditing ? <Spinner /> : <Edit2Icon className="w-4 h-4" />}
        </Button>
      }
      title={
        <>
          Edit <span className="text-primary">{target}</span>
        </>
      }
      description="This action will overwrite the current content."
      actionFunction={() => editFunction(newTitle)}
      actionLabel="Edit"
      isLoading={isEditing}
      setIsLoading={setIsEditing}
      open={open}
      onOpenChange={handleOpenChange}
      onBeforeOpen={handleBeforeOpen}
    >
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Input
            id="title-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>
      </div>
    </ConfirmationDialog>
  );
}
