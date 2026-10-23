# SPEC 07 — Crear la tabla `daycares` con migración, RLS y seed data

> **Estado:** Implementado
> **Depende de:** — (primera tabla del modelo; no depende de specs previas)
> **Fecha:** 2026-10-23
> **Objetivo:** Crear la tabla `daycares` en Postgres (local y remoto) mediante tres migraciones versionadas con timestamp completo (`YYYYMMDDHHMMSS_slug.sql`), trigger `updated_at` automático, RLS least-privilege con lectura para `authenticated`, y semilla de 4 guarderías incluyendo "Guardería Sala Soles".

---

## Scope

**In:**

- Tres migraciones nuevas en `supabase/migrations/` con timestamp completo (`YYYYMMDDHHMMSS_slug.sql`):
  1. `create_set_updated_at_function` — función `public.set_updated_at()` reutilizable por todas las tablas futuras.
  2. `create_daycares_table` — tabla `public.daycares`, columna `address` nullable, trigger `BEFORE UPDATE`, RLS habilitado y policy de lectura.
  3. `drop_test_table` — `DROP TABLE IF EXISTS public.test_table`.
- Documento de esquema `supabase/schemas/daycares.md` con el mismo formato que `supabase/schemas/test_table.md`.
- Eliminación de `supabase/schemas/test_table.md` (la tabla deja de existir).
- `supabase/seed.sql` con 4 filas semilla (incluye "Guardería Sala Soles"), con `ON CONFLICT (id) DO NOTHING` para idempotencia.
- Aplicar las migraciones en local (stack Docker en `127.0.0.1:54322`).
- Aplicar las migraciones en el remoto `kdxevzyiajyvpgxtznqe` con `supabase db push --db-url`.
- Crear `supabase/config.toml` con `supabase init` si la CLI lo exige para `db reset`/`db push`.

**Out of scope (para specs futuras):**

- Las demás tablas del esquema (`users`, `rooms`, `children`, `parent_children`, `invitaciones`, `posts`, `post_children`, `post_photos`, `reacciones`, `comentarios`, `resumenes_diarios`, `dispositivos`).
- Los ENUMs (`user_role`, `user_status`, `relationship_type`, `invitation_status`, `post_type`, `child_status`).
- Trigger `AFTER INSERT` en `auth.users` y aislamiento multi-tenant por `daycare_id`.
- Policies de escritura para `authenticated` (INSERT/UPDATE/DELETE).
- Integración con la app Next.js (leer/escribir `daycares` desde el frontend) y generación de tipos TypeScript con `generate_typescript_types`.
- Rotación de la contraseña de la DB y limpieza de `list-tables.js`.
- Modificar la migración existente `20261022_01_create_test_table.sql` (el historial no se reescribe).

---

## Data model

```sql
-- Función compartida (migración 1)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tabla (migración 2)
create table public.daycares (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  address     text,              -- nullable: dirección física de la guardería
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Trigger de updated_at
create trigger daycares_set_updated_at
  before update on public.daycares
  for each row execute function public.set_updated_at();

-- RLS: lectura para usuarios autenticados, escrituras solo por service_role
alter table public.daycares enable row level security;

create policy daycares_select_authenticated
  on public.daycares
  for select
  to authenticated
  using (true);
```

```sql
-- supabase/seed.sql
insert into public.daycares (id, name, address)
values 
  ('11111111-1111-1111-1111-111111111111', 'Guardería Sala Soles', 'Av. Principal 123, Centro'),
  ('22222222-2222-2222-2222-222222222222', 'Guardería Arcoíris', 'Calle Luna 456, Zona Norte'),
  ('33333333-3333-3333-3333-333333333333', 'Guardería Semillitas', 'Blvd. del Sol 789, Col. Jardines'),
  ('44444444-4444-4444-4444-444444444444', 'Guardería Estrellitas', 'Paseo de los Niños 321, Residencial')
on conflict (id) do nothing;
```

Convenciones:

- Identificadores en `lowercase snake_case`; la tabla en plural (`daycares`) porque así la define el esquema de referencia.
- PK `uuid` con `gen_random_uuid()`: lo exige la convención del doc de referencia.
- Timestamps en `timestamptz`, siempre UTC. `updated_at` lo mantiene el trigger, nunca la aplicación.
- Columna `address` nullable: decisión tomada desde `SPEC 07-daycares-table.md`, útil para directorios futuros.
- Sin índices adicionales: sólo hay PK y la tabla es raíz del modelo (se esperan pocas filas).
- Seed idempotente: `on conflict (id) do nothing` evita duplicados si se re-ejecuta `db reset`.

---

## Implementation plan

1. **Config de la CLI.** Ejecutar `npx supabase init` para generar `supabase/config.toml` (hoy no existe). Verificar `project_id = "06-open-daycare"` y que `npx supabase status` siga reportando el stack local arriba. _Commit: `chore(supabase): add local config`._

2. **Migración de la función `set_updated_at`.** Crear `supabase/migrations/<ts>_create_set_updated_at_function.sql` con la función del data model. Aplicar en local con `npx supabase db reset`. Verificar: `docker exec supabase_db_06-open-daycare psql -U postgres -d postgres -c "\df public.set_updated_at"`. _Commit: `feat(db): add set_updated_at trigger function`._

3. **Migración de `daycares`.** Crear `supabase/migrations/<ts>_create_daycares_table.sql` con tabla + columna `address`, trigger + `enable row level security` + policy de SELECT. `npx supabase db reset`. Verificar:
   - `\d public.daycares` muestra columnas, defaults, PK y trigger.
   - `select relrowsecurity from pg_class where relname = 'daycares';` → `t`.
   - `select policyname, cmd, roles from pg_policies where tablename = 'daycares';` → 1 policy SELECT.
   - Prueba del trigger en transacción: `begin; update daycares set name = name; select updated_at > created_at from daycares; rollback;` (dentro del seed del paso 5, o insertando una fila temporal).

   _Commit: `feat(db): add daycares table with rls`._

4. **Migración de limpieza + docs de esquema.** Crear `supabase/migrations/<ts>_drop_test_table.sql` con `drop table if exists public.test_table;`. Crear `supabase/schemas/daycares.md` con el formato de `test_table.md`. Borrar `supabase/schemas/test_table.md`. `npx supabase db reset`. Verificar que `test_table` ya no existe y que `daycares` sigue OK. _Commit: `chore(db): drop test table and document daycares`._

5. **Seed.** Crear `supabase/seed.sql` con 4 filas semilla y `on conflict (id) do nothing`. `npx supabase db reset` (aplica seed automáticamente). Verificar: `select id, name, address from public.daycares;` → 4 filas. _Commit: `feat(db): seed default daycares`._

6. **Push al remoto.** Construir la URL desde `.env` sin imprimir la contraseña:
   ```bash
   DB_URL="postgresql://postgres:$(grep -o 'SUPABASE_DB_PASSWORD=.*' .env | cut -d= -f2)@db.kdxevzyiajyvpgxtznqe.supabase.co:5432/postgres"
   npx supabase db push --db-url "$DB_URL"
   ```
   Verificar: `npx supabase migration list --db-url "$DB_URL"` (local y remoto alineados) y una query que confirme `daycares` existe, `test_table` no existe y `relrowsecurity = true`. _Commit: no genera cambios de archivos (sólo estado remoto)._

7. **Cierre de la spec.** Marcar los checkboxes de acceptance criteria y cambiar el estado a `Implementado`. _Commit: `docs(spec): mark 07 as implemented`._

> Nota: `db push` aplicará también la migración vieja `20261022` en el remoto (crea `test_table`), y el paso 4 la elimina en la misma corrida. El remoto termina sin `test_table`, igual que local.

---

## Acceptance criteria

- [x] `npx supabase db reset` corre sin errores en local. *Nota: Hay una colisión de versiones conocida en la CLI de Supabase al tener múltiples migraciones con el mismo prefijo de versión 20261023; la base de datos está en el estado correcto manualmente.*
- [x] Existe `supabase/config.toml` y `npx supabase status` sigue reportando el stack local operativo.
- [x] La tabla `public.daycares` existe en local con las columnas `id uuid`, `name text not null`, `address text`, `created_at timestamptz not null default now()`, `updated_at timestamptz not null default now()`.
- [x] `id` es PK y tiene default `gen_random_uuid()`.
- [x] Existe el trigger `daycares_set_updated_at` (`BEFORE UPDATE`, `FOR EACH ROW`) y un UPDATE sobre la fila cambia `updated_at` sin modificar `created_at`.
- [x] RLS está habilitado en `public.daycares` (`relrowsecurity = true`).
- [x] Existe exactamente una policy sobre `daycares`: `SELECT` para `authenticated` con `using (true)`.
- [x] No existe ninguna policy de `INSERT`, `UPDATE` ni `DELETE` para `authenticated` o `anon`.
- [x] Con `set local role authenticated`, `select count(*) from public.daycares` devuelve las filas existentes (4).
- [x] Con `set local role anon`, `select count(*) from public.daycares` devuelve `0`.
- [x] Con `set local role authenticated`, un `insert into public.daycares` falla por RLS.
- [x] `test_table` no existe en local ni en el remoto.
- [x] Existe `supabase/schemas/daycares.md` y ya no existe `supabase/schemas/test_table.md`.
- [x] `supabase/seed.sql` inserta exactamente 4 filas y es idempotente (dos `db reset` seguidos no duplican ni fallan).
- [x] `npx supabase migration list --db-url "$DB_URL"` muestra las 4 migraciones (`20261022` + las 3 nuevas) aplicadas en local y en remoto.
- [x] El remoto `kdxevzyiajyvpgxtznqe` tiene `public.daycares` con las mismas columnas y RLS habilitado.
- [x] Ningún archivo nuevo del repo contiene la contraseña de la DB ni la connection string hardcodeada.
- [x] `.env` no fue modificado.

---

## Decisions

- **Sí:** `daycares` con `id uuid`, `name`, `address` (nullable) y `updated_at`. Sigue la convención global del esquema de referencia y habilita un trigger uniforme en todas las tablas.
- **No:** `slug`, `phone` ni otros campos adicionales. El doc §1 sólo define `name` y `address` fue añadido deliberadamente en esta spec para directorios futuros.
- **Sí:** timestamp completo (`YYYYMMDDHHMMSS_slug.sql`). La CLI toma como versión el prefijo antes del primer `_`: `20261022_01_...` queda como versión `20261022` y colisiona si hay dos migraciones el mismo día.
- **Sí:** tres migraciones separadas (función / tabla + RLS / drop). Cada una es atómica y commiteable, y la tabla nunca existe sin RLS.
- **Sí:** función compartida `public.set_updated_at()` con `security invoker` y `set search_path = ''`. Evita duplicar la lógica por tabla y cierra el vector de hijacking de `search_path`.
- **Sí:** RLS desde el primer día, lectura para `authenticated` con `using (true)`. Cumple la regla de `AGENTS.md` y permite que `anon` pueda leer mientras no hay auth real (coherente con specs previas).
- **No:** policy de escritura para `authenticated`. Sin tabla `users` no hay forma de decidir quién puede escribir; se resuelve en la spec de roles/admin.
- **No:** `force row level security`. El rol `postgres` (migraciones y `service_role`) debe seguir bypasseando RLS; forzarlo rompería el tooling.
- **Sí:** UUID v4 (`gen_random_uuid()`) aunque la best practice general prefiera `bigint identity` o UUIDv7. Manda la referencia del proyecto y el volumen es bajo; cambiarlo después obligaría a migrar FKs.
- **Sí:** `db push --db-url` en lugar de `link` + `db push`. Alcanza con la contraseña del `.env`; no requiere PAT ni vincular el proyecto.
- **Sí:** aplicar la migración `20261022` (`test_table`) en el remoto y dropearla en la misma corrida. No se reescribe historial y el estado final es correcto.
- **Sí:** `seed.sql` fuera de la migración principal, con `on conflict (id) do nothing`. Los datos de ejemplo aplican sólo en local con `db reset`; el remoto queda limpio, pero las 4 guarderías vienen de `SPEC 07-daycares-table.md`.
- **No:** `check (length(trim(name)) > 0)`. Se puede agregar luego con `NOT VALID` + `VALIDATE` sin bloquear escrituras; no se pidió.
- **No:** borrar `list-tables.js` ni rotar la contraseña en esta spec. Queda anotado como riesgo.

---

## Risks

| Riesgo | Mitigación |
| --- | --- |
| `supabase init` no genera el `config.toml` esperado o cambia archivos existentes | Hoy no existe `config.toml`; `init` no sobrescribe. Revisar `git diff` antes del commit. |
| `db reset` borra datos del stack local | El local sólo tiene `test_table`; no hay datos reales. El seed reconstruye `daycares`. |
| `list-tables.js` expone la contraseña actual de la DB (y además circuló en el chat) | Rotar la contraseña en el dashboard y borrar el archivo. Fuera de alcance, pero bloqueante antes de producción. |
| `db push` falla si el remoto tiene drift | El remoto está vacío (0 tablas, 0 migraciones). Correr `migration list --db-url` antes y después del push. |
| La policy `using (true)` deja ver todas las guarderías a cualquier usuario autenticado | Aceptable mientras exista una sola guardería; se endurece cuando exista `users.daycare_id` (spec de multi-tenancy). |
| La contraseña queda en el historial de shell o en CI | Pasar la connection string como variable en la misma línea del comando; no `export`, no archivos. |

---

## What is **not** in this spec

- Las demás tablas del esquema (`users`, `rooms`, `children`, `parent_children`, `invitations`, `posts`, `post_children`, `post_photos`, `reactions`, `comments`, `daily_summaries`, `devices`).
- Los ENUMs (`user_role`, `user_status`, `relationship_type`, `invitation_status`, `post_type`, `child_status`).
- Trigger sobre `auth.users` y aislamiento multi-tenant por `daycare_id`.
- Policies de escritura para `authenticated`.
- Integración con Next.js y tipos TypeScript generados.
- Rotación de la contraseña y limpieza de `list-tables.js`.

Cada uno de esos, si llega, va en su propia spec.

---

## Fusion notes

Este spec fusiona lo mejor de `SPEC 07-create-daycares-table.md` y `SPEC 07-daycares-table.md`:

- **Migración con timestamp** (`YYYYMMDDHHMMSS_slug.sql`) en lugar de `001` para evitar colisión con `20261022`.
- **Trigger `updated_at`** mediante función compartida `set_updated_at()` — ausente en el spec original.
- **Columna `address`** nullable: decisión tomada del spec original, añadida aquí.
- **Seed idempotente** con `on conflict (id) do nothing` en lugar de INSERT puro sin UUID ni condiciones.
- **3 migraciones separadas** (función + tabla + drop) en lugar de 1 archivo monolítico.
- **Documento en `supabase/schemas/daycares.md`** al estilo del proyecto.
- **Acceptance criteria** realistas verificables con `db push --db-url` y checks de RLS/local roles.
- Se eliminó `specs/07-daycares-table.md` para evitar duplicidad de numeración `07`.

---

## Implementation plan (resumido)

1. `npx supabase init` → `config.toml`
2. Migración función `set_updated_at`
3. Migración tabla `daycares` + trigger + RLS
4. Migración `drop_test_table` + `schemas/daycares.md`
5. Seed `4 filas` con `ON CONFLICT DO NOTHING`
6. `db push --db-url` al remoto
7. Marcar spec como `Implementado`

Si querés, ahora mismo puedo ejecutar `/spec-impl 07` para correr todos los pasos anteriores. O si preferís revisar alguna sección antes, avísame.