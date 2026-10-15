import type { Kid } from "@/app/_data/kids";
import { room } from "@/app/_data/feed";
import { KidCard } from "@/app/_components/KidCard";

function kidsCountLabel(count: number): string {
  return `${count} ${count === 1 ? "niño" : "niños"}`;
}

export function KidsDirectory({ kids }: { kids: Kid[] }) {
  return (
    <>
      <div className="mb-3.5 flex items-center gap-3">
        <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-ink">
          {room.name.toUpperCase()}
        </span>
        <span className="text-[13px] text-ink-faint">{kidsCountLabel(kids.length)}</span>
        <span className="h-px flex-1 bg-[#E7DAC8]" />
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {kids.map((kid) => (
          <KidCard key={kid.id} kid={kid} />
        ))}
      </div>
    </>
  );
}
