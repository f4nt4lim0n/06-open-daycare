# SPEC 06 — Modal "Nueva publicación" desde el sidebar

> **Estado:** Draft
> **Depende de:** Spec 01 (home-feed) — `Sidebar`, tokens CSS y datos mock; Spec 02 (kids-list-and-profile) — `app/_data/kids.ts`
> **Fecha:** 2026-10-21
> **Objetivo:** El botón "Nueva publicación" del sidebar abre un modal calco de `references/pantallas/crear-publicacion.dc.html` que publica en el feed la publicación creada (en memoria, sin backend).

## Scope

**In:**

- El botón `Nueva publicación` del sidebar (desktop y drawer mobile) pasa de `<a href="#">` a `<button>` que abre el modal.
- Nuevo componente `components/home/NewPostModal.tsx`, calco de `references/pantallas/crear-publicacion.dc.html`:
  - Overlay oscuro translúcido con tarjeta centrada (`max-w-[580px]`, fondo `#FBF4EC`, borde `#ECE0D0`, radio 24px, sombra `0 20px 50px -24px rgba(63,54,46,.35)`).
  - Header con `Cancelar` (izquierda, `#94887B`), título `Nueva publicación` (Fredoka 18px, centrado) y `Publicar` (derecha, `#D9583C`, peso 800).
  - Sección `PARA`: selector single-select con Mateo, Sofía y Benjamín (avatar con inicial) + la opción `Toda la sala`.
  - Sección `TIPO`: 7 tipos con sus colores sólidos, single-select.
  - Sección `DESCRIPCIÓN`: textarea controlado con placeholder `Contá cómo le fue hoy…`.
  - Sección `FOTOS`: tile de foto + tile `Agregar` como placeholder visual (sin upload).
  - `Cancelar`, `Publicar`, click en el overlay y tecla Escape cierran el modal; el body no scrollea mientras está abierto.
- Estado compartido por Context (`FeedProvider`) montado en `app/layout.tsx`: expone `posts` y `publishPost()`.
- La publicación nueva aparece **arriba** del feed de `/`, con autor = niño seleccionado, audiencia = `familia de {niño}` o `toda la sala`, hora actual (`HH:MM`), 0 corazones y 0 comentarios.
- `PostType` se extiende de 3 a 7 tipos (`meal`, `nap`, `activity`, `achievement`, `mood`, `photo`, `announcement`) con sus colores; el badge del feed usa el color del tipo.
- Validación client-side: `Publicar` exige descripción no vacía, un niño seleccionado y un tipo seleccionado; si falta algo, se muestra el error y el modal no se cierra.
- `npm run lint` y `npx tsc --noEmit` pasan sin errores.

**Out of scope (para specs futuras):**

- Subida real de fotos: el tile `Agregar` es visual y no hace nada (spec futura de galería).
- Persistencia: sin backend ni localStorage, la publicación se pierde al recargar.
- Editar o eliminar publicaciones publicadas.
- Reacciones y comentarios funcionales (los contadores quedan en 0).
- Abrir el modal desde el composer `Compartí un momento…` del feed.
- Pantalla `crear-publicacion` como ruta independiente (es solo modal).
- Las demás pantallas del catálogo (`agregar-nino`, `resumen-dia`, `avisos`, `mi-cuenta`, `familia-feed`, `detalle-publicacion`, `foto`, `perfil-nino`).
> Nota: la sección `PARA` muestra Mateo, Sofía y Benjamín (3 del template) + `Toda la sala`; agregar los 8 niños de Sala Soles queda para otra spec.

## Data model

Cambios sobre `app/_data/mock.ts` (Spec 01). No hay persistencia: las publicaciones
viven en el estado de React del provider.

```ts
// Publication types offered by the new-post modal (ordered as in the template).
export const POST_TYPES = [
  'meal', 'nap', 'activity', 'achievement', 'mood', 'photo', 'announcement',
] as const;
export type PostType = (typeof POST_TYPES)[number];

export const POST_TYPE_LABEL: Record<PostType, string> = {
  meal: 'COMIDA',
  nap: 'SIESTA',
  activity: 'ACTIVIDAD',
  achievement: 'LOGRO',
  mood: 'ÁNIMO',
  photo: 'FOTO',
  announcement: 'ANUNCIO',
};

// Colors per type: `solid` for the modal pill, `badge` for the feed badge.
export const POST_TYPE_STYLE: Record<
  PostType,
  { solid: string; solidText: string; badgeBg: string; badgeText: string }
> = {
  meal: { solid: '#9A7B1E', solidText: '#FFFFFF', badgeBg: '#F7E7A6', badgeText: '#9A7B1E' },
  nap: { solid: '#E7DCF6', solidText: '#7B5FC0', badgeBg: '#E7DCF6', badgeText: '#7B5FC0' },
  activity: { solid: '#2E89A6', solidText: '#FFFFFF', badgeBg: '#C7E7F1', badgeText: '#2E89A6' },
  achievement: { solid: '#CFEBD8', solidText: '#3E9B6C', badgeBg: '#CFEBD8', badgeText: '#3E9B6C' },
  mood: { solid: '#F9D2DE', solidText: '#C56486', badgeBg: '#F9D2DE', badgeText: '#C56486' },
  photo: { solid: '#FBD8CC', solidText: '#D9684A', badgeBg: '#FBD8CC', badgeText: '#D9684A' },
  announcement: { solid: '#CCD8F4', solidText: '#4E72C8', badgeBg: '#CCD8F4', badgeText: '#4E72C8' },
};

// Audience option "Toda la sala" (single-select with the kids).
export const ROOM_AUDIENCE_ID = 'toda-la-sala';
```

Cambios sobre `app/_data/kids.ts` (Spec 02):

```ts
// Kids offered as audience in the new-post modal (the three shown in the template).
export const COMPOSER_KID_IDS: string[] = [
  'mateo-fernandez',
  'sofia-mendes',
  'benjamin-ruiz',
];

export function getComposerKids(): Kid[] {
  return kids.filter((kid) => COMPOSER_KID_IDS.includes(kid.id));
}
```

Nuevo `components/shared/FeedProvider.tsx` (Client Component):

```ts
export interface NewPostInput {
  audienceId: string; // kid id or ROOM_AUDIENCE_ID
  type: PostType;
  text: string;
}

export interface FeedContextValue {
  posts: FeedPost[];
  publishPost: (input: NewPostInput) => void;
}

export function useFeed(): FeedContextValue;
```

Convenciones:

- `publishPost` construye un `FeedPost` con `authorName`/`authorInitial`/`avatarBg`/`avatarColor` del niño elegido, `audience` = `familia de {firstName}` o `toda la sala`, `time` = hora actual `HH:MM` (24h, zero-padded, igual formato que el mock), `publishedByMe: true`, `hearts: 0`, `comments: 0` y `id` = `post-${Date.now()}`.
- La publicación nueva se inserta **al principio** del array (más reciente primero, igual que el mock `14:20 → 09:40 → 07:50`).
- Sin `photoPlaceholder`: la publicación no lleva foto (el tile de fotos es placeholder).
- `PostType` y los ids van en inglés en los datos; la etiqueta visible va en español (convención ya usada en `mock.ts`).
- El textarea del modal arranca **vacío** (el texto del template es contenido de ejemplo, no un valor por defecto).
- Sin persistencia: al recargar la página el feed vuelve al mock de `mock.ts`.

## Implementation plan

1. **Tipos de publicación.** En `app/_data/mock.ts`: agregar `POST_TYPES`,
   `POST_TYPE_LABEL` (7 entradas), `POST_TYPE_STYLE` y `ROOM_AUDIENCE_ID`.
   En `components/home/PostCard.tsx`: el badge pasa a derivarse de
   `POST_TYPE_STYLE` (los 3 tipos actuales conservan sus colores).
   _Prueba: `npx tsc --noEmit`; el feed sigue mostrando los mismos 3 posts._

2. **Audiencia.** En `app/_data/kids.ts`: agregar `COMPOSER_KID_IDS` y
   `getComposerKids()` (Mateo, Sofía, Benjamín en ese orden).
   _Prueba: `npx tsc --noEmit`._

3. **Estado del feed.** Crear `components/shared/FeedProvider.tsx`
   (Client Component) con `FeedProvider`, `useFeed()` y `publishPost(input)`:
   construye el `FeedPost` y lo antepone al array de posts.
   _Prueba: `npx tsc --noEmit`._

4. **Provider montado + lista del feed.** En `app/layout.tsx`: envolver
   `{children}` con `<FeedProvider>`. Crear `components/home/FeedList.tsx`
   (Client Component) que lee `useFeed().posts` y renderiza los `PostCard`;
   en `app/page.tsx` reemplazar el `.map` de posts por `<FeedList />`.
   _Prueba: `/` muestra los mismos 3 posts que antes._

5. **Modal — estructura.** Crear `components/publications/NewPostModal.tsx`
   (Client Component) con overlay, tarjeta y las 4 secciones (`PARA`, `TIPO`,
   `DESCRIPCIÓN`, `FOTOS`) del template; props `{ onClose }`.
   _Prueba: montarlo abierto en la home y compararlo con
   `references/pantallas/crear-publicacion.dc.html`._

6. **Modal — selección y texto.** Estado `audienceId` (default: Mateo) y `type`
   (default: Comida), pills single-select con `aria-pressed`, textarea
   controlado.
   _Prueba: clickear otra opción cambia la selección; se puede escribir._

7. **Modal — validación y publicación.** `handlePublish`: valida descripción no
   vacía, audiencia y tipo seleccionados; si falla, muestra el error bajo el
   textarea y no cierra. Si es válido, llama `publishPost()` de `useFeed()`,
   cierra y resetea el formulario.
   _Prueba: publicar vacío muestra el error; publicar válido agrega el post
   arriba del feed de `/`._

8. **Estado del modal + trigger.** Crear
   `components/publications/ComposerProvider.tsx` (Client Component) con
   `useComposer()` (`isOpen`, `open`, `close`) que renderiza el modal;
   montarlo en `app/layout.tsx` dentro de `<FeedProvider>`. Crear
   `components/publications/NewPostButton.tsx` (Client Component) con el botón
   del sidebar (mismos estilos actuales) que llama `open()`. En
   `components/shared/Sidebar.tsx` reemplazar el `<a href="#">` por
   `<NewPostButton />`.
   _Prueba: clickear `Nueva publicación` abre el modal sobre el feed._

9. **Mobile.** `SidebarContent` acepta un prop opcional `onOpenComposer`;
   `MobileNav` le pasa `() => setOpen(false)` para que el drawer se cierre al
   abrir el modal (el modal vive en el layout, no se desmonta con el drawer).
   _Prueba: en viewport angosto, abrir el modal desde el drawer muestra el
   modal sin drawer detrás._

10. **Verificación final.** Comparar el modal contra
    `references/pantallas/crear-publicacion.dc.html`; `npm run lint`;
    `npx tsc --noEmit`; sin errores en la consola.

## Acceptance criteria

- [x] En `http://localhost:3000/` el botón `Nueva publicación` del sidebar es un
      `<button>` (ya no es un link a `#`).
- [x] Clickear `Nueva publicación` abre el modal sobre el feed, sin navegar.
- [x] El modal se ve como `references/pantallas/crear-publicacion.dc.html`:
      tarjeta `#FBF4EC`, borde `#ECE0D0`, radio 24px, sombra
      `0 20px 50px -24px rgba(63,54,46,.35)`, ancho máximo 580px.
- [x] El header del modal muestra `Cancelar` a la izquierda, `Nueva publicación`
      (Fredoka 18px) al centro y `Publicar` a la derecha.
- [x] La sección `PARA` lista Mateo, Sofía, Benjamín y `Toda la sala`.
- [x] La sección `TIPO` lista los 7 tipos con sus colores: Comida, Siesta,
      Actividad, Logro, Ánimo, Foto, Anuncio.
- [x] La sección `DESCRIPCIÓN` tiene un textarea con placeholder
      `Contá cómo le fue hoy…`.
- [x] La sección `FOTOS` muestra un tile de foto y un tile `Agregar`.
- [x] `Cancelar`, la tecla Escape y el click en el overlay oscuro cierran el modal.
- [x] Con el modal abierto el body no scrollea; al cerrar se restaura.
- [x] El modal se abre desde el sidebar de desktop y desde el drawer mobile.
- [x] En mobile, al abrir el modal el drawer se cierra (no queda detrás).
- [x] `Mateo` y `Comida` vienen seleccionados por defecto, como en el template.
- [x] Clickear `Sofía` cambia la audiencia (single-select: `Mateo` deja de estar
      seleccionado).
- [x] Clickear `Toda la sala` selecciona la audiencia de sala.
- [x] Clickear `Logro` cambia el tipo (single-select).
- [x] `Publicar` con la descripción vacía muestra un error bajo el textarea y el
      modal no se cierra.
- [x] `Publicar` con descripción válida publica, cierra el modal y resetea el
      formulario.
- [x] La publicación nueva aparece **primera** en el feed de `/`.
- [x] La publicación muestra el nombre y la inicial del niño elegido, la hora
      actual en formato `HH:MM` y `publicado por vos`.
- [x] La audiencia se muestra como `familia de Mateo` (niño) o `toda la sala`
      (sala).
- [x] El badge del post muestra la etiqueta y el color del tipo elegido (p. ej.
      `COMIDA` con texto `#9A7B1E`).
- [x] La publicación nueva arranca con 0 corazones y 0 comentarios.
- [x] Publicar desde `/kids` también suma la publicación al feed de `/`.
- [x] Recargar la página quita la publicación nueva (sin persistencia).
- [x] El feed sigue mostrando los 3 posts mock con sus badges originales
      (`LOGRO` verde, `ACTIVIDAD` azul, `ANUNCIO` azul).
- [x] `npm run lint` pasa sin errores.
- [x] `npx tsc --noEmit` pasa sin errores.
- [x] No hay errores en la consola del navegador al abrir, publicar y cerrar el
      modal.

## Decisions

- **Sí:** Modal con overlay y estado de React, no ruta nueva. Lo pidió el
  usuario explícitamente y el template es una tarjeta que encaja como modal.
- **Sí:** `Publicar` crea una publicación real que aparece arriba del feed de
  `/`, en vez de un calco sin efecto. Motivo: da flujo completo sin backend.
- **Sí:** Estado compartido por Context (`FeedProvider` + `ComposerProvider`)
  montado en `app/layout.tsx`. Motivo: el botón vive en el sidebar, que se
  renderiza en `/`, `/kids` y `/kids/[id]`; con estado local en `app/page.tsx`
  el modal solo funcionaría en el feed.
- **Sí:** El modal se renderiza una sola vez, a nivel de layout (dentro de
  `ComposerProvider`). Motivo: en mobile el drawer se desmonta al cerrarse y no
  se llevaría el modal con él.
- **Sí:** El drawer mobile se cierra al abrir el modal.
- **Sí:** `PostType` se extiende de 3 a 7 tipos con `POST_TYPE_STYLE` (color
  sólido para el pill del modal + color del badge del feed). Motivo: el calco
  muestra 7 y el badge del feed debe distinguir el tipo real.
- **Sí:** Un único mapa de estilos por tipo (`POST_TYPE_STYLE`) que alimenta el
  modal y `PostCard`, en vez de dos tablas de colores que se desincronizan.
- **Sí:** La audiencia son los 3 niños del template + `Toda la sala`, no los 8 de
  Sala Soles. Motivo: calco fiel del diseño; agregar los demás queda para otra spec.
- **Sí:** `Mateo` y `Comida` vienen preseleccionados, pero son single-select y
  siempre se pueden cambiar. Motivo: el calco los muestra seleccionados.
- **Sí:** El texto del template en el textarea es contenido de ejemplo: el
  textarea arranca vacío.
- **Sí:** El `id` de la publicación nueva es `post-${Date.now()}`; suficiente
  para una sesión sin persistencia.
- **No:** Upload real de fotos. El tile `Agregar` es visual; la spec de galería
  lo implementa después.
- **No:** Persistencia (backend ni localStorage). Consistente con la Spec 05:
  la publicación se pierde al recargar.
- **No:** Abrir el modal desde el composer `Compartí un momento…` del feed. El
  usuario pidió solo el botón del sidebar.
- **No:** Editar o eliminar publicaciones, y reacciones o comentarios
  funcionales.
- **No:** Pantalla `crear-publicacion` como ruta independiente.

## Risks

| Riesgo                                                          | Mitigación                                                                 |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| El feed pasa a depender de un contexto y `app/page.tsx` deja de renderizar los posts | `app/page.tsx` sigue siendo Server Component; solo `FeedList` es client y consume el contexto. |
| El modal se desmonta al cerrar el drawer mobile                | El modal se renderiza en el layout, no dentro del drawer.                                      |
| Extender `PostType` rompe el `Record` de badges de `PostCard`   | El mapa de badges se deriva de `POST_TYPE_STYLE` en el mismo paso; `tsc` lo detecta.           |
| La publicación se pierde al recargar y confunde al usuario     | Es el comportamiento esperado (documentado); la persistencia queda para otra spec.              |
| La hora del post puede no coincidir con la del mock             | Se usa `HH:MM` local en 24h con zero-padding, el mismo formato que el mock.                     |

## What is **not** in this spec

- Subida real de fotos (el tile `Agregar` es visual).
- Persistencia: backend, base de datos o localStorage.
- Editar o eliminar publicaciones publicadas.
- Reacciones y comentarios funcionales.
- Abrir el modal desde el composer `Compartí un momento…` del feed.
- Ruta independiente `/crear-publicacion`.
- Selector de audiencia con los 8 niños de Sala Soles.
- Las demás pantallas del catálogo.

Cada uno de esos, si llega, va en su propia spec.