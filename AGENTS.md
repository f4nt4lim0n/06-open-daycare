<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Proyecto

`open-daycare`: app de guardería (App Router de Next.js). El personal gestiona niños y publica novedades; las familias activan su cuenta, vinculan al padre y ven el feed de su hijo. Toda la UI y los textos van en **español**.

## Comandos

- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint` — ejecuta `eslint` directamente (flat config, ESLint 9). No existe `next lint`.
- Typecheck: `npx tsc --noEmit` (no hay script dedicado).
- No hay test runner ni CI configurado.

## Next.js 16.4 (config no estándar)

`next.config.ts` activa flags que cambian cómo se escribe el código:

- `cacheComponents: true` + `partialPrefetching: true`: la data es **dinámica por defecto**; se cachea explícitamente con `use cache`, `cacheLife` y `cacheTag`. PPR y `<Activity>` son el comportamiento por defecto. Apóyate en `node_modules/next/dist/docs/`.
- `experimental.agentFeedback: true`.
- Turbopack es el bundler por defecto.
- Helpers de tipos globales (`LayoutProps<"/">`, `PageProps<...>`) sin importar.

## Estilos

- Tailwind CSS v4 vía el loader `@tailwindcss/turbopack` declarado en `turbopack.rules` de `next.config.ts`. **No hay** `tailwind.config.*` ni PostCSS; la config vive en `app/globals.css` (`@import "tailwindcss"` + `@theme inline`).
- Dark mode por `prefers-color-scheme` (media query), no por clase.
- Alias `@/*` → raíz del repo (no hay `src/`).

## Referencias de diseño

- `referencias/pantallas/*.dc.html` son prototipos HTML navegables con el look & feel objetivo (login, niños, feed, publicaciones, cuenta, avisos, resumen del día…). Úsalos como fuente de verdad visual.
- `referencias/pantallas/support.js` está **generado** (dc-runtime); no editarlo.
- `referencias/screenshots/*.png` son capturas de esos prototipos.

## Flujo de specs

Skills `spec` y `spec-impl` instaladas desde `klerith/fernando-skills` (ver `skills-lock.json`); no editarlas a mano. Flujo: `/spec` diseña y guarda `specs/NN-slug.md` (estado inicial `Draft`), el humano lo pasa a `Approved`, y `/spec-impl NN-slug` implementa sobre una rama `spec-NN-slug`. La creación de rama se controla con `specs/.spec-config.yml` (`AutoCreateBranch`, default `true`). Aún no existe `specs/`.

## MCPs

- Playwright: capturas y cualquier artefacto relacionado van en `.playwright-mcp/` (gitignored).
- Context7: usar para traer documentación actualizada del framework.

## Spec Driven Development - skills

- /spec Usaremos esta habilidad para crear las especificaciones.
- /spec-imp Usaremos esta skill para hacer las implementaciones. 

## Reglas de codigo

-Usar código limpio, nombres, funciones, variables, etc. en inglés.