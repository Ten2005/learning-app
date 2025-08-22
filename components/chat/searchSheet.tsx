import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TelescopeIcon, Loader2Icon } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard";
import { SearchIcon } from "lucide-react";
import { useChatStore } from "@/store/chat";
import { searchAction } from "@/app/(main)/dashboard/actions";
import { Message } from "./message";

export function SearchSheet() {
  const { currentFile } = useDashboardStore();
  const {
    messages,
    input,
    addMessage,
    setInput,
    setIsSending,
    isSending,
    clearMessages,
  } = useChatStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await setIsSending(true);
    await addMessage({ id: crypto.randomUUID(), content: input, isUser: true });
    setInput("");
    const response = await searchAction(messages);
    await addMessage({
      id: crypto.randomUUID(),
      content: response,
      isUser: false,
    });
    await setIsSending(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" disabled={!currentFile}>
          <TelescopeIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[100dvh] max-h-[100dvh]">
        <SheetHeader>
          <SheetTitle>Query Space</SheetTitle>
          <SheetDescription>Some description here.</SheetDescription>
          <div className="flex items-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => clearMessages()}
              disabled={messages.length === 0}
            >
              Clear Chat
            </Button>
          </div>
        </SheetHeader>
        <div className="flex flex-col gap-4 p-4 overflow-y-auto">
          {messages.map((message) => (
            <Message
              key={message.id}
              content={message.content}
              isUser={message.isUser}
            />
          ))}
        </div>
        <SheetFooter>
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
            />
            <Button type="submit" size="icon" disabled={isSending || !input}>
              {isSending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <SearchIcon className="size-4" />
              )}
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
