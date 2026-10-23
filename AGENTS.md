<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run lint` — runs `eslint` (flat config, ESLint 9). This is **not** `next lint`; don't run `next lint`.
- Typecheck: `npx tsc --noEmit` (there is no `typecheck` script).
- No test framework is configured — don't invent test commands.
- `npm run build` — build for production
- `npm run start` — run the production server

## Stack notes

- Next.js 16.2.10 (App Router) + React 19.2.4. TypeScript strict, `noEmit`, `moduleResolution: bundler`.
- Path alias `@/*` maps to the repo root (`./*`), not `src/`.
- Tailwind CSS v4: configured inline via `@import "tailwindcss"` + `@theme` in `app/globals.css` and the `@tailwindcss/postcss` plugin. There is **no** `tailwind.config.ts`; do not create one.

## Project context

- `open-daycare`: a Spanish-language daycare management app (staff + family/parent flows). UI copy is in Spanish.
- `app/page.tsx` is still the default create-next-app scaffold — the real UI has not been built yet.
- `references/pantallas/*.dc.html` are the design source of truth for each screen; open `references/pantallas/index.dc.html` for the catalog of 15 screens. `references/screenshots/*.png` are rendered previews. Implement against these: fonts are Fredoka (headings) + Nunito (body) on a warm palette (background `#f6ecdf`, accent `#d9583c`/`#f2937a`, staff blue `#2e89a6`, family purple `#7b5fc0`).
- Design tokens and color variables are defined in `app/globals.css` via Tailwind v4 `@theme`. No `tailwind.config.ts` exists — all config is inline.

## MCPs

- Playwright: screenshots and any Playwright output go in `.playwright-mcp/` (gitignored).
- Context7: use it to fetch current framework docs instead of relying on training data.

## Supabase

- Supabase: backend-as-a-service with Postgres, Authentication, Realtime, Storage, and Edge Functions.
- Supabase best practices: load the `supabase-postgres-best-practices` skill before writing any schema changes, RLS policies, or database functions.
- Use the Supabase CLI for local development: `supabase start`, `supabase db push`, `supabase functions serve`.
- For client integrations, refer to `supabase-js` or `@supabase/ssr` for Next.js apps.
- Security: always configure RLS policies on tables; never rely solely on authentication tokens.

## Agents

- `spec-verifier`: Verifies acceptance criteria of a spec file. Reviews implementation against each criterion, fixes code/spec issues found, and marks checkboxes. Uses Playwright MCP with vision to compare screenshots against references, and Context7 MCP to validate Next.js best practices.
- `supabase`: Use when doing ANY task involving Supabase products (Database, Auth, Edge Functions, Realtime, Storage, Vectors, Cron, Queues), client libraries, or troubleshooting errors.
- `supabase-postgres-best-practices`: Load this skill BEFORE writing or changing anything in a Postgres database: schema design, migrations, RLS policies, indexes, triggers, functions, and scheduled jobs.
- `find-skills`: Helps users discover and install agent skills when asking about new functionality.
- `report`: Use when the user wants to report an opencode issue or bug.

## Spec Driven Development - Skills

- /spec: Diseña y desarrolla specs siguiendo el método spec-driven. Pide aclaraciones antes deproponer estructura y construye la spec sección por sección.
- /spec-impl: Implementa un spec aprobado. Valida que el estado sea "Approved" y comienza la implementación paso a paso con pausas para revisar diffs.
- /verify-spec: Verifica los criterios de aceptación de un spec. Revisa la implementación contra cada criterio, arregla problemas de código/spec y marca casillas.
- /context7-mcp: Consultar documentación actual de librerías, frameworks, SDKs o APIs a través de Context7 MCP. Útil para setup, code generation con libs, o preguntas sobre React, Next.js, Prisma, Supabase, etc.
- /find-skills: Descubre e instala habilidades agentiles cuando preguntas sobre cómo hacer "X" o buscas extender capacidades.
- /opencode: Preguntas sobre OpenCode itself — cómo funciona, configuración, migración V1→V2, plugins, SDK, CLI, herramientas, permissions, MCP servers, providers, modelos.
- /report: Reportar un issue o bug de opencode. Diagnósticos estándar + contexto del usuario.
- /supabase: Cualquier tarea involving Supabase — database, auth, edge functions, realtime, storage, vectors, cron, queues, schema changes, migraciones, RLS, debugging errors, leyendo logs.
- /supabase-postgres-best-practices: Mejores prácticas Postgres para schema design, migraciones, RLS policies, indexes, triggers, funciones, queues, pgvector, y diagnóstico de slow queries.

## Idioma

- Responder siempre en español.
- No traducir código: identificadores, nombres de archivos, comandos, snippets y textos literales de código se mantienen en su idioma original (inglés).

## Reglas de código

- Usar código limpio, nombres, funciones, variables, etc. en inglés.
