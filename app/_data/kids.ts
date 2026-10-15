export type ParentStatus = "active" | "pending";

export interface Parent {
  id: string;
  name: string;
  /** Texto visible de la relación: "Mamá" / "Papá" */
  relationLabel: string;
  status: ParentStatus;
  avatarBg: string;
}

export interface Kid {
  /** Segmento de la URL: /kids/[id] */
  id: string;
  name: string;
  ageYears: number;
  roomLabel: string;
  initials: string;
  avatarBg: string;
  avatarInk: string;
  /** Badge del grid: "MANÍ", "LACTOSA" */
  allergyBadge?: string;
  /** Texto de la alerta de alergias del perfil */
  allergyNote?: string;
  birthDateLabel: string;
  entryLabel: string;
  parents: Parent[];
}

export const kids: Kid[] = [
  {
    id: "mateo",
    name: "Mateo Fernández",
    ageYears: 3,
    roomLabel: "Soles",
    initials: "M",
    avatarBg: "#A9D9E8",
    avatarInk: "#1F7A93",
    allergyBadge: "MANÍ",
    allergyNote: "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    birthDateLabel: "12 mar 2022",
    entryLabel: "feb 2025",
    parents: [
      {
        id: "lucia-fernandez",
        name: "Lucía Fernández",
        relationLabel: "Mamá",
        status: "active",
        avatarBg: "#C9B6E8",
      },
      {
        id: "diego-fernandez",
        name: "Diego Fernández",
        relationLabel: "Papá",
        status: "pending",
        avatarBg: "#A9C7E8",
      },
    ],
  },
  {
    id: "sofia-mendez",
    name: "Sofía Méndez",
    ageYears: 2,
    roomLabel: "Soles",
    initials: "S",
    avatarBg: "#F4B8CC",
    avatarInk: "#C44A7A",
    birthDateLabel: "5 sep 2024",
    entryLabel: "mar 2025",
    parents: [
      {
        id: "camila-mendez",
        name: "Camila Méndez",
        relationLabel: "Mamá",
        status: "active",
        avatarBg: "#F4B8CC",
      },
    ],
  },
  {
    id: "benjamin-ruiz",
    name: "Benjamín Ruiz",
    ageYears: 3,
    roomLabel: "Soles",
    initials: "B",
    avatarBg: "#B9DEC4",
    avatarInk: "#3E8B62",
    birthDateLabel: "20 sep 2023",
    entryLabel: "oct 2024",
    parents: [
      {
        id: "laura-ruiz",
        name: "Laura Ruiz",
        relationLabel: "Mamá",
        status: "active",
        avatarBg: "#F4DC8E",
      },
      {
        id: "andres-ruiz",
        name: "Andrés Ruiz",
        relationLabel: "Papá",
        status: "pending",
        avatarBg: "#A9C7E8",
      },
    ],
  },
  {
    id: "valentina",
    name: "Valentina Soto",
    ageYears: 2,
    roomLabel: "Soles",
    initials: "V",
    avatarBg: "#F4DC8E",
    avatarInk: "#9A7B1E",
    birthDateLabel: "18 jul 2024",
    entryLabel: "ene 2025",
    parents: [],
  },
  {
    id: "tomas-diaz",
    name: "Tomás Díaz",
    ageYears: 3,
    roomLabel: "Soles",
    initials: "T",
    avatarBg: "#C9B6E8",
    avatarInk: "#7B5FC0",
    allergyBadge: "LACTOSA",
    allergyNote: "Intolerancia a la lactosa. Leche de avena disponible en la sala.",
    birthDateLabel: "9 nov 2022",
    entryLabel: "abr 2024",
    parents: [
      {
        id: "patricia-diaz",
        name: "Patricia Díaz",
        relationLabel: "Mamá",
        status: "active",
        avatarBg: "#B9DEC4",
      },
    ],
  },
  {
    id: "emma-castro",
    name: "Emma Castro",
    ageYears: 2,
    roomLabel: "Soles",
    initials: "E",
    avatarBg: "#F4B8CC",
    avatarInk: "#C44A7A",
    birthDateLabel: "30 abr 2024",
    entryLabel: "mar 2025",
    parents: [
      {
        id: "marisol-castro",
        name: "Marisol Castro",
        relationLabel: "Mamá",
        status: "active",
        avatarBg: "#C9B6E8",
      },
    ],
  },
  {
    id: "lucas-romero",
    name: "Lucas Romero",
    ageYears: 3,
    roomLabel: "Soles",
    initials: "L",
    avatarBg: "#A9D9E8",
    avatarInk: "#1F7A93",
    birthDateLabel: "14 ago 2023",
    entryLabel: "sep 2024",
    parents: [
      {
        id: "diego-romero",
        name: "Diego Romero",
        relationLabel: "Papá",
        status: "active",
        avatarBg: "#A9C7E8",
      },
    ],
  },
  {
    id: "olivia-vega",
    name: "Olivia Vega",
    ageYears: 2,
    roomLabel: "Soles",
    initials: "O",
    avatarBg: "#B9DEC4",
    avatarInk: "#3E8B62",
    birthDateLabel: "2 dic 2024",
    entryLabel: "feb 2025",
    parents: [
      {
        id: "carolina-vega",
        name: "Carolina Vega",
        relationLabel: "Mamá",
        status: "pending",
        avatarBg: "#F4B8CC",
      },
    ],
  },
];
