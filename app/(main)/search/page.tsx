"use client";

import { useChatStore } from "@/store/chat";
import { Message } from "@/components/chat/message";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useRef, useEffect } from "react";
import { saveMessageAction } from "./actions";
import { useRouter } from "next/navigation";
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
  const prevMessagesLengthRef = useRef(0);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `/api/chat/${chatType}`,
        fetch: async (url, options) => {
          const body = JSON.parse(options?.body as string);
          body.conversationId = conversationIdRef.current;
          return fetch(url, {
            ...options,
            body: JSON.stringify(body),
          });
        },
      }),
    [chatType],
  );

  const { messages, setMessages, sendMessage, status } = useChat({
    id: chatType,
    transport,
  });

  useConversationSync(setMessages, setCurrentConversationId);

  useEffect(() => {
    if (isMobile && currentConversationId) {
      setOpenMobile(false);
    }
  }, [currentConversationId, isMobile, setOpenMobile]);

  // 最新のユーザーメッセージを画面上部にスクロール
  useEffect(() => {
    // 新しいメッセージが追加された場合のみチェック
    if (messages.length > prevMessagesLengthRef.current) {
      const lastMessage = messages[messages.length - 1];
      // 最後に追加されたメッセージがユーザーメッセージの場合のみスクロール
      if (lastMessage?.role === "user" && latestUserMessageRef.current) {
        latestUserMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    // 現在のメッセージ数を保存
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

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

  // 最新のユーザーメッセージのインデックスを見つける
  const latestUserMessageIndex = messages.reduce(
    (latestIndex, message, index) => {
      return message.role === "user" ? index : latestIndex;
    },
    -1,
  );

  return (
    <div className="flex flex-col h-[100dvh]">
      <ChatHeader
        chatType={chatType}
        onChatTypeChange={setChatType}
        onNewChat={handleClearChat}
      />
      <div className="p-2 h-[100dvh] overflow-y-auto sticky top-10 flex flex-col gap-6">
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
