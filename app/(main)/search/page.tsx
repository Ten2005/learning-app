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
        {messages.map((message) => (
          <Message
            key={message.id}
            parts={message.parts}
            isUser={message.role === "user"}
          />
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
