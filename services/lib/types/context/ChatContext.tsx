"use client";

import { createContext, useContext, useState } from "react";

type ChatContextType = {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
};

const ChatContext = createContext<ChatContextType>({
  isChatOpen: false,
  openChat: () => {},
  closeChat: () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        openChat: () => setIsChatOpen(true),
        closeChat: () => setIsChatOpen(false),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);