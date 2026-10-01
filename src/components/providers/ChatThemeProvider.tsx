"use client";

import { useChatTheme } from "@/src/hooks/useChatTheme";
import { ChatThemeProviderProps } from "@/src/types/product";
import React, { useEffect, useRef } from "react";

const ChatThemeProvider: React.FC<ChatThemeProviderProps> = ({ children }) => {
  const theme = useChatTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const docRoot = document.documentElement;
    const fallbackBg = theme.bgColor || "#E5DDD5";
    const fallbackTheme = theme.themeColor || "#128C7E";

    docRoot.style.setProperty("--chat-theme-color", fallbackTheme);
    docRoot.style.setProperty("--chat-bg-color", fallbackBg);

    if (containerRef.current) {
      const root = containerRef.current;
      root.style.setProperty("--chat-theme-color", fallbackTheme);
      root.style.setProperty("--chat-user-bubble", theme.userBubbleColor || "#DCF8C6");
      root.style.setProperty("--chat-contact-bubble", theme.contactBubbleColor || "#FFFFFF");
      root.style.setProperty("--chat-user-text", theme.userTextColor || "#000000");
      root.style.setProperty("--chat-contact-text", theme.contactTextColor || "#000000");
      root.style.setProperty("--chat-bg-color", fallbackBg);
      root.style.setProperty(
        "--chat-bg-image",
        theme.bgImage ? `url("${theme.bgImage}")` : "none",
      );
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme.themeColor) {
      root.style.setProperty("--chat-theme-color", theme.themeColor);
    }
  }, [theme.themeColor]);

  return (
    <div ref={containerRef} className="h-full w-full contents">
      {children}
    </div>
  );
};

export default ChatThemeProvider;
