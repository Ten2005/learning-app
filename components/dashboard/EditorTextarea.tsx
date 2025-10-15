import { Textarea } from "@/components/ui/textarea";
import { forwardRef } from "react";

type EditorTextareaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
};

export const EditorTextarea = forwardRef<
  HTMLTextAreaElement,
  EditorTextareaProps
>(({ value, onChange, disabled }, ref) => {
  return (
    <Textarea
      ref={ref}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="
          w-full flex-1
          resize-none border-none shadow-none focus:border-none focus-visible:ring-0"
    />
  );
});

EditorTextarea.displayName = "EditorTextarea";
