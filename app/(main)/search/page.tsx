"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon } from "lucide-react";
import { SearchIcon } from "lucide-react";
import { useChatStore } from "@/store/chat";
import { Message } from "@/components/chat/message";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { models } from "@/store/chat";
import { useMemo } from "react";

export default function SearchPage() {
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
    <div className="flex flex-col h-[100dvh] max-h-[100dvh]">
      <div className="flex flex-col gap-1 py-2 px-4">
        <h1>Query Space</h1>
        <p className="text-sm text-muted-foreground">Some description here.</p>
        <div className="flex w-full justify-between items-center">
          <Button variant="secondary" size="sm" onClick={() => setMessages([])}>
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
      </div>
      <div className="flex flex-col gap-4 px-4 overflow-y-auto h-full">
        {messages.map((message) => (
          <Message
            key={message.id}
            parts={message.parts}
            isUser={message.role === "user"}
          />
        ))}
      </div>
      <div className="flex w-full items-center gap-2 px-4 py-2">
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
      </div>
    </div>
  );
}
