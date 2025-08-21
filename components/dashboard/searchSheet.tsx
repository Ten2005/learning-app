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
import { TelescopeIcon, Loader2Icon, XIcon } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat";
import { searchAction } from "@/app/(main)/dashboard/actions";

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
      <SheetContent side="bottom" className="h-screen">
        <SheetHeader>
          <SheetTitle>Query Space</SheetTitle>
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

function Message({ content, isUser }: { content: string; isUser: boolean }) {
  return (
    <div
      className={cn(
        "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
        isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-muted",
      )}
    >
      {content}
    </div>
  );
}
