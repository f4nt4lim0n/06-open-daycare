# SPEC 02 — Listado y perfil de niños (`/kids` y `/kids/[id]`)

> **Status:** Approved
> **Depends on:** SPEC 01
> **Date:** 2026-10-15
> **Objective:** Reproducir con fidelidad visual las pantallas `referencias/pantallas/ninos.dc.html` (`/kids`) y `perfil-nino.dc.html` (`/kids/[id]`), con datos estáticos y sin backend.

## Why this spec exists

La SPEC 01 fijó el shell y los tokens. Esta spec añade las dos pantallas de gestión de niños sobre esa base, generalizando el `Sidebar` para poder marcar el item activo.

## Scope

**In:**

- Rutas `/kids` (grid) y `/kids/[id]` (perfil de cualquier niño). Nombres de ruta en inglés, textos visibles en español.
- `app/_data/kids.ts` con los 8 niños del grid; **cada niño tiene perfil completo** (alergias, nacimiento, ingreso, padres vinculados).
- `Sidebar.tsx`: prop `activeItem` (`"feed" | "kids"`); en `/kids` y `/kids/[id]` se resalta *Niños*.
- `FeedShell.tsx` renombrado a `AppShell.tsx`, con prop `activeItem` reenviada al `Sidebar`. `/` se ve idéntico.
- Búsqueda real en el frontend que filtra el grid al escribir (sin backend).
- Componentes nuevos: `KidCard`, `KidsDirectory` (client: input + grid filtrado), `ParentRow`, `AllergyAlert`.
- Enlaces con ruta real solo: tarjetas → `/kids/[id]`, "Volver a Niños" → `/kids`. Todo lo demás (`Editar`, `Resumen del día`, `Vincular otro padre`, nav del sidebar, logout) queda `href="#"`.
- SVG nuevos en `icons.tsx`: search, chevron-right, arrow-left, alert-triangle.
- Comparación con `referencias/screenshots/ninos.png` y `ninos2.png` (perfil).

**Out of scope (para specs futuras):**

- Backend, base de datos, API y persistencia.
- Pantallas `agregar-nino`, `resumen-dia`, `vincular-padre` (siguen en `href="#"`).
- Autenticación y cierre de sesión real.
- Estado vacío de "sin resultados" en la búsqueda más allá del grid vacío.
- Dark mode.

## Data model

Nuevo archivo `app/_data/kids.ts`:

```ts
export type ParentStatus = "active" | "pending";

export interface Parent {
  id: string;
  name: string;           // "Lucía Fernández"
  relationLabel: string;  // "Mamá" / "Papá" (texto visible)
  status: ParentStatus;
  avatarBg: string;       // "#C9B6E8"
}

export interface Kid {
  id: string;             // "mateo" (segmento de la URL)
  name: string;
  ageYears: number;       // 3
  roomLabel: string;      // "Soles"
  initials: string;       // "M"
  avatarBg: string;       // "#A9D9E8"
  avatarInk: string;      // "#1F7A93"
  allergyBadge?: string;  // "MANÍ", "LACTOSA" (badge del grid)
  allergyNote?: string;   // texto de la alerta del perfil
  birthDateLabel: string; // "12 mar 2022"
  entryLabel: string;     // "feb 2025"
  parents: Parent[];
}

export const kids: Kid[] = [/* los 8 del prototipo */];
```

Reglas de presentación derivadas (no se guardan en datos):

- Contadores: `0` → "sin padres vinculados", `1` → "1 padre vinculado", `n` → `${n} padres vinculados`.
- Badge del grid: si hay `allergyBadge` se muestra; si no, y `parents.length === 0`, badge `VINCULAR`; si no, chevron-right.
- Estado del padre: `active` → "Mamá · activa" + chip `ACTIVA` verde; `pending` → "Papá · invitación enviada" + chip `PENDIENTE` amarillo.

## Implementation plan

1. **Datos.** Crear `app/_data/kids.ts` con los tipos y los 8 niños (perfil completo para todos). Verificación: `npx tsc --noEmit` limpio.
2. **Iconos.** Añadir `SearchIcon`, `ChevronRightIcon`, `ArrowLeftIcon`, `AlertTriangleIcon` a `app/_components/icons.tsx`, copiando `viewBox`, `stroke-width` y `stroke-linecap` del prototipo.
3. **Generalizar el shell.** Renombrar `FeedShell.tsx` → `AppShell.tsx`, añadir prop `activeItem` pasada al `Sidebar`; en `Sidebar.tsx` la prop marca el item activo. Actualizar el import en `app/page.tsx`. Verificación: `/` se ve idéntico a la SPEC 01 y `npm run lint` limpio.
4. **`/kids`.** Crear `app/kids/page.tsx` (server) con `AppShell activeItem="kids"`, cabecera `GESTIÓN` / `Niños` + botón *Agregar niño* (`href="#"`), y `KidsDirectory` con `kids`. Crear `app/_components/KidCard.tsx` (avatar, nombre, meta, badge/chevron, hover `border-[#F2A78E]` + `translateY(-2px)`). Verificación: el grid de 2 columnas se ve a `max-width: 880px`.
5. **Búsqueda.** Crear `app/_components/KidsDirectory.tsx` ("use client"): input con `SearchIcon` y estado `query` que filtra por nombre con `localeCompare` en locale "es". Verificación: escribiendo "sof" solo queda Sofía Méndez.
6. **Perfil.** Crear `app/kids/[id]/page.tsx`: `await params`, busca el niño en `kids`, `notFound()` si no existe; layout a dos columnas (`max-width: 820px`): enlace *Volver a Niños* → `/kids`, avatar 84px, nombre, "3 años · Sala Soles", botón *Editar* (`href="#"`), `AllergyAlert` (`app/_components/AllergyAlert.tsx`) y tarjeta de datos (Fecha de nacimiento / Sala / Ingreso); columna derecha: botón *Resumen del día* (`href="#"`) y tarjeta *PADRES VINCULADOS* con un `ParentRow` por padre + enlace *Vincular otro padre* (`href="#"`). Verificación: `/kids/mateo` muestra el perfil del prototipo.
7. **Cualquier niño.** Comprobar `/kids/valentina` (sin padres: tarjeta solo con el enlace *Vincular otro padre*) y `/kids/tomas-diaz` (id sin tildes). `npx tsc --noEmit` limpio.
8. **Verificación visual.** `npm run build` + `npm run lint` + `npx tsc --noEmit`; capturas Playwright de `/kids` y `/kids/mateo` en `.playwright-mcp/` para comparar contra `referencias/screenshots/ninos.png` y `ninos2.png`.

## Acceptance criteria

- [ ] `/kids` renderiza el grid sin errores en consola, con *Niños* como item activo del sidebar.
- [ ] `/kids` tiene cabecera `GESTIÓN` + `Niños`, botón *Agregar niño* y el buscador con icono de lupa.
- [ ] Se ven las 8 tarjetas en 2 columnas, con la fila `SALA SOLES · 8 niños` y su separador, dentro de `max-width: 880px`.
- [ ] Los badges `MANÍ`, `LACTOSA` y `VINCULAR` tienen sus colores exactos; el resto de tarjetas muestra chevron-right.
- [ ] Al hacer hover sobre una tarjeta, el borde pasa a `#F2A78E` y la tarjeta se desplaza 2px hacia arriba.
- [ ] Escribir en el buscador filtra el grid por nombre; borrar el input restaura los 8.
- [ ] Las tarjetas navegan a `/kids/[id]` con ruta real.
- [ ] `/kids/mateo` muestra la alerta de alergias, la tarjeta de datos (12 mar 2022 / Soles / feb 2025) y los 2 padres con chips `ACTIVA` y `PENDIENTE`.
- [ ] Cualquier `/kids/[id]` de los 8 renderiza sus propios datos; un id inexistente devuelve 404.
- [ ] "Volver a Niños" navega a `/kids`; el resto de enlaces son `href="#"`.
- [ ] `/` se ve visualmente idéntico a la SPEC 01 tras el renombre a `AppShell`.
- [ ] Con viewport de 375px no hay scroll horizontal y el drawer del sidebar sigue funcionando.
- [ ] `npm run lint`, `npx tsc --noEmit` y `npm run build` terminan sin errores.
- [ ] `package.json` no suma dependencias.
- [ ] Las capturas de `.playwright-mcp/` coinciden con `referencias/screenshots/ninos.png` y `ninos2.png`.

## Decisions

- **Sí:** rutas en inglés (`/kids`, `/kids/[id]`) con UI en español. Regla de nombres en inglés del repo, textos visibles del prototipo.
- **Sí:** perfil dinámico con datos por niño. El grid enlaza a 8 niños distintos; un perfil estático quedaría forzado.
- **Sí:** `activeItem` en `Sidebar` + renombre `FeedShell` → `AppShell`. Evita duplicar el shell por pantalla (DRY) y `/` no cambia visualmente.
- **Sí:** búsqueda real en cliente dentro de `KidsDirectory`. La pidió el usuario y no requiere backend.
- **No:** backend, API o persistencia. Confirmado por el usuario.
- **No:** rutas `agregar-nino`, `resumen-dia`, `vincular-padre`. Solo interfaces futuras; hoy `href="#"`.
- **Sí:** ids sin tildes ni espacios (`valentina`, `tomas-diaz`). URLs limpias sin manejo de encoding.
- **Sí:** reutilizar tokens de la SPEC 01 y valores arbitrarios de Tailwind donde no haya token, mismo criterio de la spec anterior.

## Risks

| Risk | Mitigation |
| --- | --- |
| Renombrar `FeedShell` rompe la SPEC 01 | Actualizar el import en `page.tsx` y verificar `/` en navegador y captura |
| `params` es una Promesa en Next 16 | `const { id } = await params` y `notFound()` para ids desconocidos |
| Diferencias al pasar estilos inline a Tailwind | Valores arbitrarios y comparación con las capturas de referencia |

## What is **not** in this spec

- Backend, base de datos y API.
- Pantallas `agregar-nino`, `resumen-dia`, `vincular-padre`.
- Autenticación y logout real.
- Dark mode.

Cada uno, si llega, va en su propia spec.