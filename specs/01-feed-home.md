# SPEC 01 — Home `/` con el feed de la sala

> **Status:** Draft
> **Depends on:** —
> **Date:** 2026-10-14
> **Objective:** Reproducir en `/` la pantalla `referencias/pantallas/feed.dc.html` con fidelidad visual completa, sin autenticación ni base de datos, y sidebar responsive colapsable en mobile.

## Why this spec exists

`app/` todavía contiene el boilerplate de create-next-app. Esta spec fija la base visual del producto (tokens de color, tipografías y shell con sidebar) sobre la que colgarán las demás pantallas.

## Scope

**In:**

- Sustituir el contenido de `app/page.tsx` por el feed del prototipo: sidebar, cabecera, composer y los 3 posts.
- Tokens de color/tipografía del prototipo en `app/globals.css` (`@theme inline`).
- Fredoka y Nunito vía `next/font/google`.
- Sidebar y tarjeta de post como componentes reutilizables.
- Datos de la pantalla (usuario, sala y 3 posts) en un módulo tipado.
- Light-only, sin dark mode, layout de escritorio fijo (760px centrado).

**Out of scope (para specs futuras):**

- Autenticación, sesión y cierre de sesión funcional.
- Base de datos, persistencia y API.
- Rutas `/ninos`, `/avisos`, `/mi-cuenta`, `/crear-publicacion`, `/detalle-publicacion`, `/foto`.
- Likes y comentarios funcionales (solo contadores estáticos).
- Responsive móvil (si, tiene que ser responsive).
- Dark mode e i18n.

## Data model

**Sí introduce estructuras nuevas**, todas en `app/_data/feed.ts`:

```ts
export type PostKind = "achievement" | "activity" | "announcement";

export interface PostAttachment {
  type: "photo";
  label: string;
}

export interface Post {
  id: string;
  kind: PostKind;
  authorName: string;        // "Mateo" o "Anuncio general"
  time: string;              // "14:20"
  audienceLabel: string;     // "Para: familia de Mateo"
  body: string;
  likes: number;
  comments: number;
  attachment?: PostAttachment;
}

export const currentUser = { name: "Caro Giménez", initial: "C", role: "Maestra · Soles" };
export const room = { name: "Sala Soles", meta: "12 niños · martes 17 jun" };
export const posts: Post[] = [/* 3 posts del prototipo */];
```

Convención de `kind`: los valores son claves internas en inglés; el texto visible del badge se traduce en la capa de presentación (`achievement` → `LOGRO`, `activity` → `ACTIVIDAD`, `announcement` → `ANUNCIO`). `kind` también define el avatar: inicial del niño para `achievement`/`activity`, icono de megáfono para `announcement`.

## Implementation plan

1. **Tokens y tipografías.** Editar `app/globals.css` (tokens `@theme inline`: `--color-canvas`, `--color-surface`, `--color-line`, `--color-ink`, `--color-ink-soft`, `--color-ink-faint`, `--color-brand`, `--color-brand-dark`, `--color-nav-active`, `--font-display`, `--font-body`; quitar el bloque `@media (prefers-color-scheme: dark)`; scrollbar del prototipo) y `app/layout.tsx` (`lang="es"`, fuentes Fredoka/Nunito como variables, `metadata.title = "OpenDayCare"`, fondo y color base). Verificación: `npm run dev` sigue levantando y el texto base se ve en Nunito.
2. **Datos.** Crear `app/_data/feed.ts` con los tipos y valores de arriba. Verificación: `npx tsc --noEmit` limpio.
3. **Iconos.** Crear `app/_components/icons.tsx` con los SVG inline copiados del prototipo (logo, plus, home, niños, campana, usuario, logout, cámara, corazón, comentario, imagen, megáfono), conservando `viewBox`, `stroke-width` y `stroke-linecap` originales.
4. **Sidebar.** Crear `app/_components/Sidebar.tsx` (logo + nombre de sala, botón *Nueva publicación*, nav con `Feed` activo, bloque de usuario con inicial y logout) y montarlo en `app/page.tsx` reemplazando el boilerplate. Verificación: el shell de dos columnas se ve en `/`.
5. **PostCard.** Crear `app/_components/PostCard.tsx` que recibe `Post` y renderiza avatar/badge, autor y hora, audiencia, cuerpo, adjunto opcional (placeholder de foto) y la barra de acciones con contadores. Verificación: `npm run lint` limpio.
6. **Composición del feed.** Completar `app/page.tsx`: cabecera (`GUARDERÍA · SALA SOLES`, *Buenas, Caro*, `12 niños · martes 17 jun`), composer, separador `PUBLICADO HOY` y `posts.map(PostCard)`. Todos los enlaces del prototipo quedan en `href="#"`.
7. **Verificación visual.** `npm run build` + `npm run lint` + `npx tsc --noEmit`, y captura de `/` con Playwright guardada en `.playwright-mcp/feed.png` para comparar contra `referencias/screenshots/feed.png`.

## Acceptance criteria

- [ ] `/` renderiza el feed sin errores en consola.
- [ ] `<html lang="es">` y `title = "OpenDayCare"`.
- [ ] El sidebar mide 248px, es sticky a 100vh y muestra logo, botón *Nueva publicación*, los 4 items con `Feed` como activo (`--color-nav-active`) y el bloque de usuario "Caro Giménez / Maestra · Soles".
- [ ] La columna de contenido está centrada con `max-width: 760px`.
- [ ] Se ven el composer y las 3 tarjetas de post, en el orden del prototipo.
- [ ] Los badges `LOGRO`, `ACTIVIDAD` y `ANUNCIO` tienen sus colores de fondo, punto y texto exactos.
- [ ] El post de actividad muestra el placeholder de foto punteado con el texto "Foto · pintando con témperas".
- [ ] Los contadores muestran 3/5/8 likes y 1/2/0 comentarios.
- [ ] Todos los enlaces tienen `href="#"`.
- [ ] Con `prefers-color-scheme: dark` activo, el resultado visual es idéntico al light.
- [ ] `npx tsc --noEmit`, `npm run lint` y `npm run build` terminan sin errores.
- [ ] `package.json` no suma dependencias.
- [ ] La captura `.playwright-mcp/feed.png` coincide con `referencias/screenshots/feed.png` en layout, tipografías y colores.

## Decisions

- **Sí:** Tailwind v4 con tokens en `@theme inline`. Es el stack del repo; evita un patrón nuevo y mantiene la identidad visual.
- **No:** CSS inline literales del prototipo ni CSS Modules. Duplican el sistema de estilos ya existente.
- **Sí:** datos en `app/_data/feed.ts` con tipos. Separa datos de presentación y prepara la futura DB.
- **No:** rutas placeholder. No aportan al objetivo visual y agrandan la spec.
- **Sí:** `href="#"`. Comunica que la navegación aún no existe.
- **Sí:** `Sidebar` y `PostCard` como componentes. Se reutilizan en las próximas pantallas y evitan triplicar JSX.
- **Sí:** SVG inline. Paridad exacta de trazos y cero dependencias nuevas.
- **No:** `lucide-react`. Sus trazos no coinciden con el prototipo.
- **Sí:** `next/font/google`. Mecanismo nativo de Next, sin `<link>` externo en runtime.
- **Sí:** light-only, quitando el dark mode del boilerplate. El prototipo no tiene versión oscura.
- **No:** responsive móvil en esta spec. No hay referencia visual que replicar.
- **Sí:** valores del modelo (`PostKind`) en inglés; solo la capa de presentación traduce a español. El código sigue la regla de nombres en inglés del repo sin perder los textos visibles del prototipo.
- **Sí:** comparación con captura Playwright como criterio de aceptación.

## Risks

| Risk | Mitigation |
| --- | --- |
| `next/font/google` descarga las fuentes en build; requiere red | Build con red disponible; si falla, es un fallo de entorno, no del código |
| Pequeñas diferencias al traducir estilos inline a clases Tailwind | Usar valores arbitrarios (`text-[15.5px]`) cuando el token no aplique, y validar con la captura |
| Los SVG inline pierden atributos al copiarse | Comparar visualmente cada icono en la captura final |

## What is **not** in this spec

- Autenticación, sesión y cierre de sesión.
- Base de datos, persistencia y API.
- Las demás pantallas de `referencias/pantallas/`.
- Likes/comentarios funcionales.
- Responsive móvil, dark mode e i18n.

Cada uno de esos puntos, si llega, va en su propia spec.
