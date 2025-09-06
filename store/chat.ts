import { create } from "zustand";

export interface Message {
  role: "user" | "assistant" | "developer";
  content: string;
}

export const models = [
  "gpt-5-nano",
  "gpt-5-mini",
  "gpt-5",
  "o4-mini-deep-research",
  "gpt-oss-20b",
  "gpt-oss-120b",
  "gpt-4.1",
  "gpt-5-chat-latest",
  "chatgpt-4o-latest",
];
type Model = (typeof models)[number];
export interface UIMessage {
  id: string;
  content: string;
  isUser: boolean;
}
interface ChatStore {
  input: string;
  setInput: (input: string) => void;

  messages: UIMessage[];
  addMessage: (message: UIMessage) => void;
  clearMessages: () => void;

  isSending: boolean;
  setIsSending: (isSending: boolean) => void;

  isConfirmingMemo: boolean;
  setIsConfirmingMemo: (isConfirmingMemo: boolean) => void;

  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;

  isIncludeContext: boolean;
  setIsIncludeContext: (isIncludeContext: boolean) => void;

  selectedModel: Model;
  setSelectedModel: (selectedModel: Model) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  input: "",
  setInput: (input) => set({ input }),

  messages: [],
  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },
  clearMessages: () => set({ messages: [] }),

  isSending: false,
  setIsSending: (isSending) => set({ isSending }),

  isConfirmingMemo: false,
  setIsConfirmingMemo: (isConfirmingMemo) => set({ isConfirmingMemo }),

  isAdding: false,
  setIsAdding: (isAdding) => set({ isAdding }),

  isIncludeContext: false,
  setIsIncludeContext: (isIncludeContext) => set({ isIncludeContext }),
  selectedModel: models[0],
  setSelectedModel: (selectedModel: Model) => set({ selectedModel }),
}));
