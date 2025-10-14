import type { ChatStatus } from "ai";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import TextareaAutosize from "react-textarea-autosize";

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
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 px-2 pb-4 sticky bottom-0 bg-background"
    >
      <InputGroup>
        <TextareaAutosize
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onInputChange(e.target.value)
          }
          className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none"
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton
            type="submit"
            className="ml-auto"
            size="sm"
            variant="default"
            disabled={!input || !isReady}
            aria-busy={!isReady}
          >
            {!isReady && <Spinner />}
            Submit
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
