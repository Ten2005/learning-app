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
import { DefaultChatTransport, UIMessage } from "ai";
import { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { saveMessageAction, readMessagesAction } from "./actions";
import { useSearchParams } from "next/navigation";
import type { DbMessage } from "@/lib/db/chat";
import { chatOptions } from "@/store/chat";
import { ChatType } from "@/store/chat";

type TextPart = Extract<UIMessage["parts"][number], { type: "text" }>;
function isTextPart(part: UIMessage["parts"][number]): part is TextPart {
  return part.type === "text";
}

export default function SearchPage() {
  const {
    currentConversationId,
    setCurrentConversationId,
    chatType,
    setChatType,
  } = useChatStore();
  const searchParams = useSearchParams();
  const { input, setInput } = useChatStore();
  const conversationIdRef = useRef<number | null>(null);
  useEffect(() => {
    conversationIdRef.current = currentConversationId;
  }, [currentConversationId]);
  const transport = useMemo(
    () => new DefaultChatTransport({ api: `/api/chat/${chatType}` }),
    [chatType],
  );
  const { messages, setMessages, sendMessage, status } = useChat({
    transport,
    onFinish: async ({ message }) => {
      try {
        const text = (message.parts ?? [])
          .map((part) => (isTextPart(part) ? part.text : ""))
          .join("");
        if (text) {
          const savedId = await saveMessageAction(
            conversationIdRef.current,
            text,
            "assistant",
          );
          if (!conversationIdRef.current) setCurrentConversationId(savedId);
        }
      } catch (err) {
        console.error(err);
      }
    },
  });

  useEffect(() => {
    const c = searchParams.get("c");
    const parsed = c ? Number(c) : null;
    if (!parsed || Number.isNaN(parsed)) {
      setCurrentConversationId(null);
      setMessages([]);
      return;
    }
    setCurrentConversationId(parsed);
    (async () => {
      try {
        const dbMessages = await readMessagesAction(parsed);
        setMessages(
          dbMessages.map((m: DbMessage) => ({
            id: String(m.id),
            role: m.role,
            parts: [{ type: "text", text: m.content }],
          })),
        );
      } catch (e) {
        console.error(e);
      }
    })();
  }, [searchParams, setMessages, setCurrentConversationId]);

  const handleClearChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  return (
    <div className="flex flex-col h-[100dvh] max-h-[100dvh]">
      <div className="flex flex-col gap-1 py-2 px-4">
        <div className="flex flex-row justify-between items-center">
          <h1>Query Space</h1>
          <Button variant="link" asChild>
            <Link href="/dashboard" prefetch>
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <div className="flex w-full justify-between items-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              handleClearChat();
            }}
          >
            Clear Chat
          </Button>
          <Select onValueChange={setChatType} defaultValue={chatType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {chatOptions.map((value) => (
                <SelectItem key={value} value={value as ChatType}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-4 overflow-auto w-fit h-full">
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
            if (!input || status !== "ready") return;
            const sendInput = await input;
            setInput("");
            const returnConversationId = await saveMessageAction(
              currentConversationId,
              sendInput,
              "user",
            );
            setCurrentConversationId(returnConversationId);
            await sendMessage({ text: sendInput });
          }}
          className="flex w-full items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status !== "ready"}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input || status !== "ready"}
            aria-busy={status !== "ready"}
          >
            {status == "ready" ? (
              <SearchIcon className="size-4" />
            ) : (
              <Loader2Icon className="size-4 animate-spin" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
