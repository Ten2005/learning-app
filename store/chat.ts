import { create } from "zustand";

interface ChatStore {
  input: string;
  setInput: (input: string) => void;

  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;

  isSending: boolean;
  setIsSending: (isSending: boolean) => void;

  isConfirmingMemo: boolean;
  setIsConfirmingMemo: (isConfirmingMemo: boolean) => void;

  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;

  isIncludeContext: boolean;
  setIsIncludeContext: (isIncludeContext: boolean) => void;
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
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),

  isSending: false,
  setIsSending: (isSending) => set({ isSending }),

  isConfirmingMemo: false,
  setIsConfirmingMemo: (isConfirmingMemo) => set({ isConfirmingMemo }),

  isAdding: false,
  setIsAdding: (isAdding) => set({ isAdding }),

  isIncludeContext: false,
  setIsIncludeContext: (isIncludeContext) => set({ isIncludeContext }),
}));
