import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { kids } from "@/app/_data/kids";
import { AllergyAlert } from "@/app/_components/AllergyAlert";
import { AppShell } from "@/app/_components/AppShell";
import { ParentRow } from "@/app/_components/ParentRow";
import { ArrowLeftIcon, LogoIcon, PlusIcon } from "@/app/_components/icons";

export default function KidProfilePage(props: PageProps<"/kids/[id]">) {
  return (
    <AppShell activeItem="kids">
      <div className="mx-auto w-full max-w-[820px] px-4 pt-6 pb-20 sm:px-10 sm:pt-[34px]">
        <Link
          href="/kids"
          className="mb-5 flex items-center gap-[7px] text-sm font-bold text-[#94887B]"
        >
          <ArrowLeftIcon />
          Volver a Niños
        </Link>

        {/* params se espera dentro del boundary para que el shell se pueda prerenderizar. */}
        <Suspense fallback={null}>
          <KidProfile params={props.params} />
        </Suspense>
      </div>
    </AppShell>
  );
}

async function KidProfile({ params }: Pick<PageProps<"/kids/[id]">, "params">) {
  const { id } = await params;
  const kid = kids.find((item) => item.id === id);

  if (!kid) notFound();

  return (
    <div className="flex flex-wrap items-start gap-[26px]">
      <div className="flex min-w-[300px] flex-1 flex-col gap-[18px]">
        <header className="flex items-center gap-[18px]">
          <span
            className="flex size-[84px] flex-none items-center justify-center rounded-full font-display text-[34px] font-semibold"
            style={{ backgroundColor: kid.avatarBg, color: kid.avatarInk }}
          >
            {kid.initials}
          </span>
          <div className="flex-1">
            <h1 className="font-display text-[28px] font-semibold text-ink">{kid.name}</h1>
            <p className="mt-[3px] text-[15px] text-[#94887B]">
              {kid.ageYears} años · Sala {kid.roomLabel}
            </p>
          </div>
          <a
            href="#"
            className="rounded-[12px] border-[1.5px] border-line bg-surface px-4 py-[9px] text-sm font-bold text-ink-soft"
          >
            Editar
          </a>
        </header>

        {kid.allergyNote && <AllergyAlert note={kid.allergyNote} />}

        <dl className="divide-y divide-[#F0E6D8] overflow-hidden rounded-[16px] border border-line bg-surface">
          <DetailRow label="Fecha de nacimiento" value={kid.birthDateLabel} />
          <DetailRow label="Sala" value={kid.roomLabel} />
          <DetailRow label="Ingreso" value={kid.entryLabel} />
        </dl>
      </div>

      <div className="flex w-[300px] flex-none flex-col gap-3.5">
        <a
          href="#"
          className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-ink py-[13px] text-[15px] font-extrabold text-white"
        >
          {/* Reutiliza el glifo del logo: es el mismo sol del prototipo. */}
          <LogoIcon width={18} height={18} strokeWidth={2} />
          Resumen del día
        </a>

        <section className="rounded-[16px] border border-line bg-surface px-[18px] py-4">
          <h2 className="mb-3.5 text-[12.5px] font-extrabold tracking-[0.8px] text-[#8A7C6D]">
            PADRES VINCULADOS
          </h2>
          <div className="flex flex-col gap-3.5">
            {kid.parents.map((parent) => (
              <ParentRow key={parent.id} parent={parent} />
            ))}
            <a href="#" className="flex items-center gap-3 pt-2">
              <span className="flex size-10 flex-none items-center justify-center rounded-full border-[1.5px] border-dashed border-[#D8CBBA] text-[#B0A290]">
                <PlusIcon width={18} height={18} strokeWidth={2.2} stroke="currentColor" />
              </span>
              <span className="text-[14.5px] font-extrabold text-[#C5503A]">
                Vincular otro padre
              </span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 px-[18px] py-[15px]">
      <dt className="text-[14.5px] text-[#94887B]">{label}</dt>
      <dd className="text-[14.5px] font-extrabold text-ink">{value}</dd>
    </div>
  );
}
