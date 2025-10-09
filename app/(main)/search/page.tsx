"use client";

import { useChatStore } from "@/store/chat";
import { Message } from "@/components/chat/message";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useRef, useEffect } from "react";
import { saveMessageAction } from "./actions";
import { useRouter } from "next/navigation";
import { extractMessageText } from "@/utils/message";
import { useConversationSync } from "@/hooks/search/useConversationSync";
import { ChatHeader } from "@/components/chat/chatHeader";
import { ChatInput } from "@/components/chat/chatInput";
import { useSidebar } from "@/components/ui/sidebar";

export default function SearchPage() {
  const {
    currentConversationId,
    setCurrentConversationId,
    chatType,
    setChatType,
    input,
    setInput,
  } = useChatStore();
  const router = useRouter();
  const conversationIdRef = useRef<number | null>(currentConversationId);
  const { isMobile, setOpenMobile } = useSidebar();
  const latestUserMessageRef = useRef<HTMLDivElement>(null);
  const previousUserMessageKeyRef = useRef<string | null>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: `/api/chat/${chatType}` }),
    [chatType],
  );

  const { messages, setMessages, sendMessage, status } = useChat({
    id: chatType,
    transport,
    onFinish: async ({ message }) => {
      try {
        const text = extractMessageText(message);
        if (text) {
          await saveMessageAction(conversationIdRef.current, text, "assistant");
        }
      } catch (error) {
        console.error("Failed to save assistant message:", error);
      }
    },
  });

  useConversationSync(setMessages, setCurrentConversationId);

  useEffect(() => {
    if (isMobile && currentConversationId) {
      setOpenMobile(false);
    }
  }, [currentConversationId, isMobile, setOpenMobile]);

  const { latestUserMessage, latestUserMessageIndex } = useMemo(() => {
    let latestIndex = -1;
    let latestMessage: (typeof messages)[number] | null = null;

    messages.forEach((message, index) => {
      if (message.role === "user") {
        latestIndex = index;
        latestMessage = message;
      }
    });

    return {
      latestUserMessage: latestMessage,
      latestUserMessageIndex: latestIndex,
    };
  }, [messages]);

  const latestUserMessageKey = useMemo(() => {
    if (latestUserMessageIndex === -1 || !latestUserMessage) {
      return null;
    }

    const text = extractMessageText(latestUserMessage) ?? "";
    const id = latestUserMessage.id ?? `index-${latestUserMessageIndex}`;

    return `${id}:${text}`;
  }, [latestUserMessage, latestUserMessageIndex]);

  // 最新のユーザーメッセージを画面上部にスクロール
  useEffect(() => {
    if (!latestUserMessageKey) {
      previousUserMessageKeyRef.current = null;
      return;
    }

    const hasPreviousUserMessage = previousUserMessageKeyRef.current !== null;
    const hasNewUserMessage =
      previousUserMessageKeyRef.current !== latestUserMessageKey;

    if (hasNewUserMessage && latestUserMessageRef.current) {
      latestUserMessageRef.current.scrollIntoView({
        behavior: hasPreviousUserMessage ? "smooth" : "auto",
        block: "start",
      });
    }

    previousUserMessageKeyRef.current = latestUserMessageKey;
  }, [latestUserMessageKey]);

  const handleClearChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    router.push("/search");
  };

  const handleSubmit = async (inputText: string) => {
    const savedId = await saveMessageAction(
      currentConversationId,
      inputText,
      "user",
    );
    conversationIdRef.current = savedId;
    setCurrentConversationId(savedId);
    await sendMessage({ text: inputText });
  };

  return (
    <div className="flex flex-col h-[100dvh]">
      <ChatHeader
        chatType={chatType}
        onChatTypeChange={setChatType}
        onNewChat={handleClearChat}
      />
      <div className="p-2 h-[100dvh] overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={message.id}
            ref={index === latestUserMessageIndex ? latestUserMessageRef : null}
          >
            <Message parts={message.parts} isUser={message.role === "user"} />
          </div>
        ))}
      </div>
      <ChatInput
        input={input}
        status={status}
        onInputChange={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
