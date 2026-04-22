"use client";

import * as React from "react";
import * as store from "@/lib/key-store";

type Ctx = {
  key: string | null;
  setKey: (k: string) => void;
  clearKey: () => void;
};

const KeyContext = React.createContext<Ctx | null>(null);

const getServerSnapshot = () => null;

export function KeyProvider({ children }: { children: React.ReactNode }) {
  const key = React.useSyncExternalStore(
    React.useCallback((onChange) => store.subscribe(onChange), []),
    store.getKey,
    getServerSnapshot,
  );

  const value = React.useMemo<Ctx>(
    () => ({
      key,
      setKey: (k) => store.setKey(k),
      clearKey: () => store.clearKey(),
    }),
    [key],
  );

  return <KeyContext.Provider value={value}>{children}</KeyContext.Provider>;
}

export function useApiKey() {
  const ctx = React.useContext(KeyContext);
  if (!ctx) throw new Error("useApiKey must be used within KeyProvider");
  return ctx;
}
