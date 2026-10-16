import { currentUser, room } from "@/app/_data/feed";
import {
  BellIcon,
  ChildrenIcon,
  HomeIcon,
  LogoIcon,
  LogoutIcon,
  PlusIcon,
  UserIcon,
} from "@/app/_components/icons";

const navItems = [
  { id: "feed", label: "Feed", Icon: HomeIcon },
  { id: "kids", label: "Niños", Icon: ChildrenIcon },
  { id: "avisos", label: "Avisos", Icon: BellIcon },
  { id: "mi-cuenta", label: "Mi cuenta", Icon: UserIcon },
] as const;

/** Pantallas que hoy tienen ruta real; "avisos" y "mi-cuenta" llegan en specs futuras. */
export type ActiveNavItem = "feed" | "kids";

interface SidebarProps {
  activeItem: ActiveNavItem;
  /** El drawer móvil pasa esta acción para cerrarse al pulsar un enlace. */
  onNavigate?: () => void;
}

export function Sidebar({ activeItem, onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col border-line bg-surface px-4 py-6">
      <a href="#" onClick={onNavigate} className="flex items-center gap-[11px] px-2 pb-[22px] pt-1">
        <span className="flex size-[38px] flex-none items-center justify-center rounded-xl bg-gradient-to-br from-[#F8C3A8] to-[#F2937A]">
          <LogoIcon width={21} height={21} />
        </span>
        <span className="min-w-0">
          <span className="block font-display text-[17px] font-semibold leading-none text-ink">
            OpenDayCare
          </span>
          <span className="mt-0.5 block text-[11.5px] text-ink-faint">{room.name}</span>
        </span>
      </a>

      <a
        href="#"
        onClick={onNavigate}
        className="mb-[18px] flex w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] py-3 text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,0.75)]"
      >
        <PlusIcon />
        Nueva publicación
      </a>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = id === activeItem;

          return (
            <a
              key={label}
              href="#"
              onClick={onNavigate}
              className={
                isActive
                  ? "flex items-center gap-3 rounded-xl bg-nav-active px-3 py-[11px] text-[14.5px] font-extrabold text-brand-dark"
                  : "flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px] font-semibold text-ink-soft"
              }
            >
              <Icon />
              {label}
            </a>
          );
        })}
      </nav>

      <div className="mt-2.5 border-t border-line pt-3.5">
        <div className="flex items-center gap-[11px] px-2 py-1.5">
          <span className="flex size-[38px] flex-none items-center justify-center rounded-full bg-[#F2937A] font-display text-base font-semibold text-white">
            {currentUser.initial}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold text-ink">{currentUser.name}</span>
            <span className="block text-xs text-ink-faint">{currentUser.role}</span>
          </span>
          <a
            href="#"
            onClick={onNavigate}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="flex size-8 flex-none items-center justify-center rounded-[10px] bg-canvas text-[#94887B]"
          >
            <LogoutIcon />
          </a>
        </div>
      </div>
    </div>
  );
}