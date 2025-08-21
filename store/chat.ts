import { create } from "zustand";

interface ChatStore {
  input: string;
  setInput: (input: string) => void;

  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;

  isSending: boolean;
  setIsSending: (isSending: boolean) => void;
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

export const useChatStore = create<ChatStore>((set) => ({
  input: "",
  setInput: (input) => set({ input }),

  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),

  isSending: false,
  setIsSending: (isSending) => set({ isSending }),
}));