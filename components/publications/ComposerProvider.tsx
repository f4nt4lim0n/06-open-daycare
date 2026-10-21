"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { NewPostModal } from "./NewPostModal";

interface ComposerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ComposerContext = createContext<ComposerContextValue | undefined>(
  undefined,
);

export function ComposerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ComposerContext.Provider value={{ isOpen, open, close }}>
      {children}
      <NewPostModal isOpen={isOpen} onClose={close} />
    </ComposerContext.Provider>
  );
}

export function useComposer(): ComposerContextValue {
  const result = useContext(ComposerContext);
  if (!result) {
    throw new Error("useComposer must be used within a ComposerProvider");
  }
  return result;
}
