export type PostKind = "achievement" | "activity" | "announcement";

export interface PostAttachment {
  type: "photo";
  label: string;
}

export interface Post {
  id: string;
  kind: PostKind;
  authorName: string;
  time: string;
  audienceLabel: string;
  body: string;
  likes: number;
  comments: number;
  attachment?: PostAttachment;
}

export const currentUser = {
  name: "Caro Giménez",
  initial: "C",
  role: "Maestra · Soles",
};

export const room = {
  name: "Sala Soles",
  meta: "12 niños · martes 17 jun",
};

export const posts: Post[] = [
  {
    id: "post-1",
    kind: "achievement",
    authorName: "Mateo",
    time: "14:20",
    audienceLabel: "Para: familia de Mateo",
    body: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
  },
  {
    id: "post-2",
    kind: "activity",
    authorName: "Mateo",
    time: "09:40",
    audienceLabel: "Para: familia de Mateo",
    body: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    likes: 5,
    comments: 2,
    attachment: {
      type: "photo",
      label: "Foto · pintando con témperas",
    },
  },
  {
    id: "post-3",
    kind: "announcement",
    authorName: "Anuncio general",
    time: "07:50",
    audienceLabel: "Para: toda la sala",
    body: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
  },
];
