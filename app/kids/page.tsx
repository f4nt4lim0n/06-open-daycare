import { kids } from "@/app/_data/kids";
import { AppShell } from "@/app/_components/AppShell";
import { KidsDirectory } from "@/app/_components/KidsDirectory";
import { PlusIcon } from "@/app/_components/icons";

export default function KidsPage() {
  return (
    <AppShell activeItem="kids">
      <div className="mx-auto w-full max-w-[880px] px-4 pt-6 pb-20 sm:px-10 sm:pt-[34px]">
        <header className="mb-[22px] flex items-end justify-between gap-4">
          <div>
            <div className="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-brand-dark">
              GESTIÓN
            </div>
            <h1 className="font-display text-[30px] font-semibold text-ink">Niños</h1>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 rounded-[14px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,0.7)]"
          >
            <PlusIcon />
            Agregar niño
          </a>
        </header>

        <KidsDirectory kids={kids} />
      </div>
    </AppShell>
  );
}
