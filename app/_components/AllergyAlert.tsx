import { AlertTriangleIcon } from "@/app/_components/icons";

export function AllergyAlert({ note }: { note: string }) {
  return (
    <div className="flex gap-3.5 rounded-[16px] bg-[#FBDAD6] px-[18px] py-4">
      <span className="flex size-10 flex-none items-center justify-center rounded-[11px] bg-[#F4A8A0]">
        <AlertTriangleIcon />
      </span>
      <span>
        <span className="mb-0.5 block text-[15px] font-extrabold text-[#C5413A]">
          Alergias y notas
        </span>
        <span className="block text-[14.5px] leading-[1.5] text-[#B25249]">{note}</span>
      </span>
    </div>
  );
}
