export type PostType = "meal" | "nap" | "activity" | "achievement" | "mood" | "photo" | "announcement";
export type NavIcon = "home" | "kids" | "bell" | "user";

// Publication types offered by the new-post modal (ordered as in the template).
export const POST_TYPES = [
  "meal",
  "nap",
  "activity",
  "achievement",
  "mood",
  "photo",
  "announcement",
] as const;

// Visual labels (Spanish) per type — data is in English, UI in Spanish.
export const POST_TYPE_LABEL: Record<PostType, string> = {
  meal: "COMIDA",
  nap: "SIESTA",
  activity: "ACTIVIDAD",
  achievement: "LOGRO",
  mood: "ÁNIMO",
  photo: "FOTO",
  announcement: "ANUNCIO",
};

// Colors per type: `solid` for the modal pill, `badge` for the feed badge.
export const POST_TYPE_STYLE: Record<
  PostType,
  { solid: string; solidText: string; badgeBg: string; badgeText: string }
> = {
  meal: { solid: "#9A7B1E", solidText: "#FFFFFF", badgeBg: "#F7E7A6", badgeText: "#9A7B1E" },
  nap: { solid: "#E7DCF6", solidText: "#7B5FC0", badgeBg: "#E7DCF6", badgeText: "#7B5FC0" },
  activity: { solid: "#2E89A6", solidText: "#FFFFFF", badgeBg: "#C7E7F1", badgeText: "#2E89A6" },
  achievement: { solid: "#CFEBD8", solidText: "#3E9B6C", badgeBg: "#CFEBD8", badgeText: "#3E9B6C" },
  mood: { solid: "#F9D2DE", solidText: "#C56486", badgeBg: "#F9D2DE", badgeText: "#C56486" },
  photo: { solid: "#FBD8CC", solidText: "#D9684A", badgeBg: "#FBD8CC", badgeText: "#D9684A" },
  announcement: { solid: "#CCD8F4", solidText: "#4E72C8", badgeBg: "#CCD8F4", badgeText: "#4E72C8" },
};

// Audience option "Toda la sala" (single-select with the kids).
export const ROOM_AUDIENCE_ID = "toda-la-sala";

export interface FeedPost {
  id: string;
  authorName: string; // "Mateo" | "Anuncio general"
  authorInitial?: string; // "M" (omitted when the avatar uses an icon)
  avatarBg: string; // "#A9D9E8" | "#CCD8F4"
  avatarColor: string; // "#1F7A93" | "#4E72C8"
  avatarIcon?: "megaphone"; // present on the announcement post
  time: string; // "14:20"
  publishedByMe: boolean; // → "publicado por vos"
  type: PostType;
  audience: string; // "familia de Mateo" | "toda la sala"
  text: string;
  photoPlaceholder?: { label: string }; // "Foto · pintando con témperas"
  hearts: number;
  comments: number;
}

export interface NavItem {
  label: string;
  icon: NavIcon;
  active: boolean;
  href: string;
}

export interface SidebarUser {
  name: string; // "Caro Giménez"
  role: string; // "Maestra · Soles"
  initial: string; // "C"
}

export const sidebarUser: SidebarUser = {
  name: "Caro Giménez",
  role: "Maestra · Soles",
  initial: "C",
};

export const roomSubtitle: string = "12 niños · martes 17 jun";

export const navItems: NavItem[] = [
  { label: "Feed", icon: "home", active: false, href: "/" },
  { label: "Niños", icon: "kids", active: false, href: "/kids" },
  { label: "Avisos", icon: "bell", active: false, href: "#" },
  { label: "Mi cuenta", icon: "user", active: false, href: "#" },
];

export function getActiveNav(pathname: string): NavItem[] {
  const items = navItems.map((item) => ({ ...item, active: false }));
  if (pathname === '/' || pathname === '') {
    items[0].active = true;
  } else if (pathname.startsWith('/kids')) {
    items[1].active = true;
  }
  return items;
}

export const posts: FeedPost[] = [
  {
    id: "logro-mateo",
    authorName: "Mateo",
    authorInitial: "M",
    avatarBg: "#A9D9E8",
    avatarColor: "#1F7A93",
    time: "14:20",
    publishedByMe: true,
    type: "achievement",
    audience: "familia de Mateo",
    text: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    hearts: 3,
    comments: 1,
  },
  {
    id: "actividad-mateo",
    authorName: "Mateo",
    authorInitial: "M",
    avatarBg: "#A9D9E8",
    avatarColor: "#1F7A93",
    time: "09:40",
    publishedByMe: true,
    type: "activity",
    audience: "familia de Mateo",
    text: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    photoPlaceholder: { label: "Foto · pintando con témperas" },
    hearts: 5,
    comments: 2,
  },
  {
    id: "anuncio-general",
    authorName: "Anuncio general",
    avatarBg: "#CCD8F4",
    avatarColor: "#4E72C8",
    avatarIcon: "megaphone",
    time: "07:50",
    publishedByMe: true,
    type: "announcement",
    audience: "toda la sala",
    text: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    hearts: 8,
    comments: 0,
  },
];
