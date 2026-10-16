import type { Parent, ParentStatus } from "@/app/_data/kids";

const chipStyles: Record<ParentStatus, { label: string; className: string }> = {
  active: { label: "ACTIVA", className: "bg-[#CFEBD8] text-[#3E9B6C]" },
  pending: { label: "PENDIENTE", className: "bg-[#F7E7A6] text-[#9A7B1E]" },
};

/** El adjetivo concuerda con la relación: "Mamá · activa" / "Papá · activo". */
function statusDetail(relationLabel: string, status: ParentStatus): string {
  if (status === "pending") return "invitación enviada";
  return relationLabel === "Mamá" ? "activa" : "activo";
}

export function ParentRow({ parent }: { parent: Parent }) {
  const chip = chipStyles[parent.status];

  return (
    <div className="flex items-center gap-3">
      <span
        className="flex size-10 flex-none items-center justify-center rounded-full font-display text-[16px] font-semibold text-white"
        style={{ backgroundColor: parent.avatarBg }}
      >
        {parent.name.charAt(0)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-extrabold text-ink">{parent.name}</span>
        <span className="block text-[12.5px] text-ink-faint">
          {parent.relationLabel} · {statusDetail(parent.relationLabel, parent.status)}
        </span>
      </span>
      <span
        className={`flex-none rounded-full px-[9px] py-1 text-[10.5px] font-extrabold ${chip.className}`}
      >
        {chip.label}
      </span>
    </div>
  );
}
