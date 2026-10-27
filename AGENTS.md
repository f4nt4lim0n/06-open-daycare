<!-- BEGIN:nextjs-agent-rules -->

# Esto NO es el Next.js que conoces

Esta versión tiene cambios que rompen la API — las convenciones y la estructura de archivos pueden diferir de tus datos de entrenamiento. Lee la guía relevante en `node_modules/next/dist/docs/` antes de escribir cualquier código. Ten en cuenta los avisos de deprecación.

<!-- END:nextjs-agent-rules -->

## Comandos

- `npm run dev` — servidor dev en http://localhost:3000
- `npm run lint` — ejecuta `eslint` (flat config, ESLint 9). Esto **no** es `next lint`; no ejecutes `next lint`.
- Typecheck: `npx tsc --noEmit` (no hay script de typecheck).
- No hay framework de pruebas configurado — no inventes comandos de prueba.
- `npm run build` — compilación para producción
- `npm run start` — ejecutar el servidor de producción

## Notas del stack

- Next.js 16.2.10 (App Router) + React 19.2.4. TypeScript estricto, `noEmit`, `moduleResolution: bundler`.
- Alias de ruta `@/*` mapea al root del repositorio (`./*`), no a `src/`.
- Tailwind CSS v4: configurado de forma inline vía `@import "tailwindcss"` + `@theme` en `app/globals.css` y el plugin `@tailwindcss/postcss`. No existe `tailwind.config.ts` — no lo crees.

## Contexto del proyecto

- `open-daycare`: una app de guardería en español (flujos de personal + familia/padres). El copy de UI está en español.
- `app/page.tsx` sigue siendo el scaffold por defecto de create-next-app — la UI real aún no ha sido construida.
- `references/pantallas/*.dc.html` son la fuente de verdad de diseño para cada pantalla; abre `references/pantallas/index.dc.html` para el catálogo de 15 pantallas. `references/screenshots/*.png` son previews renderizados. Implementa contra estos: las fuentes son Fredoka (títulos) + Nunito (cuerpo) en una paleta cálida (fondo `#f6ecdf`, acento `#d9583c`/`#f2937a`, azul staff `#2e89a6`, familia `#7b5fc0`).
- Los tokens de diseño y variables de color están definidos en `app/globals.css` vía Tailwind v4 `@theme`. No existe `tailwind.config.ts` — toda la configuración es inline.

## MCPs

- Playwright: capturas de pantalla y cualquier salida de Playwright van en `.playwright-mcp/` (gitignorado).
- Context7: úsalo para obtener la documentación actual del framework en lugar de confiar en los datos de entrenamiento.

## Supabase

- Supabase: backend-as-a-service con Postgres, Authentication, Realtime, Storage y Edge Functions.
- Mejores prácticas de Supabase: carga la habilidad `supabase-postgres-best-practices` antes de escribir cualquier cambio de esquema, políticas RLS o funciones de base de datos.
- Usa la CLI de Supabase para desarrollo local: `supabase start`, `supabase db push`, `supabase functions serve`.
- **Client helpers**: Usa `@supabase/ssr` + `@supabase/supabase-js` para todas las interacciones con la base de datos desde la app Next.js.
- **Server components**: `import createClient from @/utils/supabase/server` (usa `createServerClient` con manejo de sesión basado en cookies).
- **Client components**: `import createClient from @/utils/supabase/client` (usa `createBrowserClient`).
- **Middleware**: `import createClient from @/utils/supabase/middleware` (refresh de sesión en cada petición).
- **Migraciones obligatorias**: Toda manipulación de base de datos (DDL o DML) DEBE aplicarse mediante `apply_migration`. Nunca uses `execute_sql` para cambios permanentes — solo para consultas temporales o depuración.
- **Cambios de esquema**: Itera con `execute_sql` si es necesario, luego confirma vía `apply_migration` con un archivo de migración limpio.
- **Datos de semilla**: Inserta vía migración, no SQL crudo. Usa `ON CONFLICT DO NOTHING` para idempotencia.
- **RLS**: Habilita Row Level Security en cada tabla en esquemas expuestos. Nunca uses `user_metadata` para autorización — usa `raw_app_meta_data` / `app_metadata` en su lugar.
- **Seguridad**: Nunca expongas la clave `service_role` en código de cliente. Usa claves publicables para el frontend. Las vistas saltan RLS por defecto — usa `security_invoker = true`.
- **CLI**: Usa `supabase migration new <name>` para crear archivos de migración. Verifica la versión con `supabase --version`.

## Agentes

- `spec-verifier`: Verifica los criterios de aceptación de un spec. Revisa la implementación contra cada criterio, arregla problemas de código/spec y marca casillas. Usa Playwright MCP con visión para comparar capturas de pantalla contra referencias, y Context7 MCP para validar mejores prácticas de Next.js.
- `supabase`: Úsalo cuando hagas CUALquier tarea que involucre productos de Supabase (Database, Auth, Edge Functions, Realtime, Storage, Vectors, Cron, Queues), bibliotecas cliente o para depurar errores.
- `supabase-postgres-best-practices`: Carga esta habilidad ANTES de escribir o cambiar cualquier cosa en una base de datos Postgres: diseño de esquema, migraciones, políticas RLS, índices, triggers, funciones y trabajos programados.
- `find-skills`: Ayuda a los usuarios a descubrir e instalar habilidades agentiles cuando preguntan sobre nueva funcionalidad.
- `report`: Usa cuando el usuario quiera reportar un issue o bug de opencode.

## Desarrollo guiado por specs - Skills

- /spec: Diseña y desarrolla specs siguiendo el método spec-driven. Pide aclaraciones antes deproponer estructura y construye la spec sección por sección.
- /spec-impl: Implementa un spec aprobado. Valida que el estado sea "Approved" y comienza la implementación paso a paso con pausas para revisar diffs.
- /verify-spec: Verifica los criterios de aceptación de un spec. Revisa la implementación contra cada criterio, arregla problemas de código/spec y marca casillas.
- /context7-mcp: Consultar documentación actual de librerías, frameworks, SDKs o APIs a través de Context7 MCP. Útil para setup, code generation con libs, o preguntas sobre React, Next.js, Prisma, Supabase, etc.
- /find-skills: Descubre e instala habilidades agentiles cuando preguntas sobre cómo hacer "X" o buscas extender capacidades.
- /opencode: Preguntas sobre OpenCode itself — cómo funciona, configuración, migración V1→V2, plugins, SDK, CLI, herramientas, permissions, MCP servers, providers, modelos.
- /report: Reportar un issue o bug de opencode. Diagnósticos estándar + contexto del usuario.
- /supabase: Cualquier tarea involving Supabase — database, auth, edge functions, realtime, storage, vectors, cron, queues, schema changes, migraciones, RLS, debugging errors, leyendo logs.
- /supabase-postgres-best-practices: Mejores prácticas Postgres para schema design, migraciones, RLS policies, indexes, triggers, funciones, queues, pgvector, y diagnóstico de slow queries.
- /spec-db: Cualquier especificación relacionada con la base de datos debe ubicarse en la carpeta `spec/database`.

## Idioma

- Responder siempre en español.
- No traducir código: identificadores, nombres de archivos, comandos, snippets y textos literales de código se mantienen en su idioma original (inglés).

## Reglas de código

- Usar código limpio, nombres, funciones, variables, etc. en inglés.