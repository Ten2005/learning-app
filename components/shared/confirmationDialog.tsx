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
import { Spinner } from "@/components/ui/spinner";
import { ReactNode, useState } from "react";
import { buttonVariants } from "@/components/ui/button";

export interface ConfirmationDialogProps {
  // Trigger button
  trigger: ReactNode;

  // Dialog content
  title: ReactNode;
  description?: ReactNode;

  // Action function
  actionFunction: () => Promise<void>;

  // Button labels
  actionLabel?: string;
  cancelLabel?: string;

  // Loading state (optional, managed internally if not provided)
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;

  // Dialog state control (optional)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Callbacks
  onBeforeOpen?: () => void;
  onSuccess?: () => void;

  // Custom content (e.g., input fields)
  children?: ReactNode;

  // Styling
  titleClassName?: string;
  actionVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export default function ConfirmationDialog({
  trigger,
  title,
  description,
  actionFunction,
  actionLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading: externalIsLoading,
  setIsLoading: externalSetIsLoading,
  open: externalOpen,
  onOpenChange,
  onBeforeOpen,
  onSuccess,
  children,
  titleClassName,
  actionVariant = "default",
}: ConfirmationDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalIsLoading, setInternalIsLoading] = useState(false);

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled
    ? onOpenChange || setInternalOpen
    : setInternalOpen;

  const isLoadingControlled = externalIsLoading !== undefined;
  const isLoading = isLoadingControlled ? externalIsLoading : internalIsLoading;
  const setIsLoading = isLoadingControlled
    ? externalSetIsLoading || setInternalIsLoading
    : setInternalIsLoading;

  const handleAction = async () => {
    setIsLoading(true);
    try {
      await actionFunction();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(false);
    } else {
      onBeforeOpen?.();
      setOpen(true);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="overflow-x-auto scrollbar-hide">
          <AlertDialogTitle
            className={
              titleClassName ||
              "overflow-x-auto scrollbar-hide whitespace-nowrap"
            }
          >
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              handleAction();
            }}
            disabled={isLoading}
            className={buttonVariants({ variant: actionVariant })}
          >
            {isLoading ? <Spinner /> : actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
