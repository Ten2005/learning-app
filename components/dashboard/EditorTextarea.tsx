import { Textarea } from "@/components/ui/textarea";

type EditorTextareaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
};

export function EditorTextarea({
  value,
  onChange,
  disabled,
}: EditorTextareaProps) {
  return (
    <Textarea
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="
        w-full flex-1
        resize-none border-none shadow-none focus:border-none focus-visible:ring-0"
    />
  );
}
