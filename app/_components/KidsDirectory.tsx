"use client";

import { useState } from "react";
import type { Kid } from "@/app/_data/kids";
import { room } from "@/app/_data/feed";
import { KidCard } from "@/app/_components/KidCard";
import { SearchIcon } from "@/app/_components/icons";

function kidsCountLabel(count: number): string {
  return `${count} ${count === 1 ? "niño" : "niños"}`;
}

/** Sin tildes ni mayúsculas, para que "sof" y "sofía" encuentren a Sofía Méndez. */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("es");
}

export function KidsDirectory({ kids }: { kids: Kid[] }) {
  const [query, setQuery] = useState("");

  const normalizedQuery = normalize(query);
  const visibleKids = normalizedQuery
    ? kids.filter((kid) => normalize(kid.name).includes(normalizedQuery))
    : kids;

  return (
    <>
      <div className="mb-[22px] flex items-center gap-[11px] rounded-[14px] border border-line bg-surface px-4 py-3">
        <SearchIcon className="flex-none" stroke="#B0A290" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar niño…"
          aria-label="Buscar niño"
          className="flex-1 border-none bg-transparent text-[15px] text-ink placeholder:text-[#B6A99B] focus:outline-none"
        />
      </div>

      <div className="mb-3.5 flex items-center gap-3">
        <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-ink">
          {room.name.toUpperCase()}
        </span>
        <span className="text-[13px] text-ink-faint">{kidsCountLabel(visibleKids.length)}</span>
        <span className="h-px flex-1 bg-[#E7DAC8]" />
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {visibleKids.map((kid) => (
          <KidCard key={kid.id} kid={kid} />
        ))}
      </div>
    </>
  );
}
