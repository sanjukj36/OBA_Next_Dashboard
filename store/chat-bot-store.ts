import { create } from "zustand";
import { ChatBot } from "@/types/chat-bot";

interface ChatBotState {
  open: boolean;
  setOpen: (open: boolean) => void;
  chat: ChatBot[];
  addChat: (chat: ChatBot) => void;
  deleteAllChat: () => void;
  removeLastItem: () => void;
}

export const useChatBotStore = create<ChatBotState>(set => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
  chat: [{ answer: "Hi, How can I help you today", owner: "bot" }],
  addChat: chat => {
    set(prev => ({ chat: [...prev.chat, chat] }));
  },
  removeLastItem: () => {
    set(prev => {
      return { chat: prev.chat.slice(0, prev.chat.length - 1) };
    });
  },
  deleteAllChat: () => {
    set({ chat: [] });
  }
}));
