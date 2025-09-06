"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TelescopeIcon } from "lucide-react";
import { Loader2Icon } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard";
import { SearchIcon } from "lucide-react";
import { useChatStore } from "@/store/chat";
import { Message } from "./message";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { models } from "@/store/chat";
import { useMemo } from "react";

export function SearchSheet() {
  const { currentFile } = useDashboardStore();
  const {
    input,
    setInput,
    selectedModel,
    setSelectedModel,
    isSending,
    setIsSending,
  } = useChatStore();
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { model: selectedModel },
      }),
    [selectedModel],
  );
  const { messages, setMessages, sendMessage } = useChat({ transport });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" disabled={!currentFile}>
          <TelescopeIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[100dvh] max-h-[100dvh] gap-0"
        isArrow
      >
        <SheetHeader>
          <SheetTitle>Query Space</SheetTitle>
          <SheetDescription>Some description here.</SheetDescription>
          <div className="flex w-full justify-between items-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMessages([])}
            >
              Clear Chat
            </Button>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 overflow-y-auto h-full">
          {messages.map((message) => (
            <Message
              key={message.id}
              parts={message.parts}
              isUser={message.role === "user"}
            />
          ))}
        </div>
        <SheetFooter>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!input || isSending) return;
              try {
                setIsSending(true);
                const sendInput = await input;
                setInput("");
                await sendMessage({ text: sendInput });
              } finally {
                setIsSending(false);
              }
            }}
            className="flex w-full items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input || isSending}
              aria-busy={isSending}
            >
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
