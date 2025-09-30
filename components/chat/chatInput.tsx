import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2Icon, SearchIcon } from "lucide-react";
import type { ChatStatus } from "ai";

interface ChatInputProps {
  input: string;
  status: ChatStatus;
  onInputChange: (value: string) => void;
  onSubmit: (input: string) => Promise<void>;
}

export function ChatInput({
  input,
  status,
  onInputChange,
  onSubmit,
}: ChatInputProps) {
  const isReady = status === "ready";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || !isReady) return;

    const currentInput = input;
    onInputChange("");
    await onSubmit(currentInput);
  };

  return (
    <div className="flex w-full items-center gap-2 px-4 py-2 sticky bottom-0 bg-background">
      <form onSubmit={handleSubmit} className="flex w-full items-start gap-2">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={!isReady}
          className="resize-none"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input || !isReady}
          aria-busy={!isReady}
        >
          {isReady ? (
            <SearchIcon className="size-4" />
          ) : (
            <Loader2Icon className="size-4 animate-spin" />
          )}
        </Button>
      </form>
    </div>
  );
}
