"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CloseIcon, MenuIcon } from "@/app/_components/icons";
import { Sidebar } from "@/app/_components/Sidebar";

export function FeedShell({ children }: { children: ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    if (!isNavOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsNavOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isNavOpen]);

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="sticky top-0 hidden h-screen w-[248px] flex-none border-r border-line md:block">
        <Sidebar />
      </aside>

      {isNavOpen && <NavDrawer onClose={() => setIsNavOpen(false)} />}

      <main className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface px-4 md:hidden">
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={isNavOpen}
            onClick={() => setIsNavOpen(true)}
            className="flex size-10 items-center justify-center rounded-xl border border-line text-ink-soft"
          >
            <MenuIcon />
          </button>
          <span className="font-display text-[17px] font-semibold text-ink">OpenDayCare</span>
        </div>

        {children}
      </main>
    </div>
  );
}

function NavDrawer({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Cerrar menú"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />
      <div className="absolute inset-y-0 left-0 w-[248px] shadow-xl">
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="absolute right-3 top-6 z-10 flex size-9 items-center justify-center rounded-lg bg-canvas text-ink-soft"
        >
          <CloseIcon />
        </button>
        <Sidebar onNavigate={onClose} />
      </div>
    </div>
  );
}