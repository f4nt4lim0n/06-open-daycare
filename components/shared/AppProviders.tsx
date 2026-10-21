"use client";

import type { ReactNode } from "react";
import { FeedProvider } from "@/components/shared/FeedProvider";
import { ComposerProvider } from "@/components/publications/ComposerProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <FeedProvider>
      <ComposerProvider>{children}</ComposerProvider>
    </FeedProvider>
  );
}
