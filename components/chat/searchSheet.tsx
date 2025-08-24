"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Message } from "./message";
import { useChat } from "@ai-sdk/react";

export function SearchSheet() {
  const { currentFile } = useDashboardStore();
  const {
    input,
    setInput,
    isSending,
    clearMessages,
    isIncludeContext,
    setIsIncludeContext,
  } = useChatStore();

  const { messages, sendMessage } = useChat();

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
          <div className="flex w-full justify-between items-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => clearMessages()}
              disabled={messages.length === 0}
            >
              Clear Chat
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                id="include-context"
                checked={isIncludeContext}
                onCheckedChange={setIsIncludeContext}
              />
              <Label
                htmlFor="include-context"
                className={isIncludeContext ? "text-primary" : ""}
              >
                Include current file as context
              </Label>
            </div>
          </div>
        </SheetHeader>
        <div className="flex flex-col gap-4 p-4 overflow-y-auto">
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
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput("");
            }}
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
