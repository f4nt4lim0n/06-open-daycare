import Link from "next/link";
import type { Kid } from "@/app/_data/kids";
import { ChevronRightIcon } from "@/app/_components/icons";

const badgeBase = "flex-none rounded-full px-[9px] py-[5px] text-[11px] font-extrabold";

function parentsLabel(count: number): string {
  if (count === 0) return "sin padres vinculados";
  if (count === 1) return "1 padre vinculado";
  return `${count} padres vinculados`;
}

export function KidCard({ kid }: { kid: Kid }) {
  return (
    <Link
      href={`/kids/${kid.id}`}
      className="flex min-w-0 items-center gap-3.5 rounded-[18px] border border-line bg-surface p-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,0.5)] transition-[.15s] hover:-translate-y-0.5 hover:border-[#F2A78E]"
    >
      <span
        className="flex size-12 flex-none items-center justify-center rounded-full font-display text-[19px] font-semibold"
        style={{ backgroundColor: kid.avatarBg, color: kid.avatarInk }}
      >
        {kid.initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[16px] font-semibold text-ink">
          {kid.name}
        </span>
        <span className="block text-[13px] text-ink-faint">
          {kid.ageYears} años · {parentsLabel(kid.parents.length)}
        </span>
      </span>
      <KidBadge kid={kid} />
    </Link>
  );
}

function KidBadge({ kid }: { kid: Kid }) {
  if (kid.allergyBadge) {
    return (
      <span className={`${badgeBase} bg-[#FBD8CC] text-[#D9684A]`}>{kid.allergyBadge}</span>
    );
  }

  if (kid.parents.length === 0) {
    return <span className={`${badgeBase} bg-[#F9D2DE] text-[#C56486]`}>VINCULAR</span>;
  }

  return <ChevronRightIcon className="flex-none" stroke="#CBB89F" />;
}
