"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";

type HeaderConfig = {
  title?: string;
  showBackButton?: boolean;
  showNotifications?: boolean;
};

type HeaderContextType = {
  header: HeaderConfig;
  setHeader: (config: HeaderConfig) => void;
};

const HeaderContext = createContext<HeaderContextType | null>(null);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<HeaderConfig>({
    title: "YuvaCrix",
    showBackButton: false,
    showNotifications: true,
  });

  const value = useMemo(
    () => ({
      header,
      setHeader,
    }),
    [header],
  );

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);

  if (!context) {
    throw new Error("useHeader must be used inside HeaderProvider");
  }

  return context;
}
