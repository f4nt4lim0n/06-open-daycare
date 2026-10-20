# SPEC 03 — Login y activación de cuenta (calco de login.dc.html + activar-cuenta.dc.html)

> **Estado:** Approved
> **Depende de:** Spec 01 (home-feed) — reutiliza fuentes (Fredoka/Nunito) y tokens CSS
> **Fecha:** 2026-10-16
> **Objetivo:** Implementar `/login` (sin selector de rol) y `/activate-account` como calco visual de sus templates, con links que navegan a nivel frontend y sin autenticación ni validaciones.

## Scope

**In:**

- Página `/login` en `app/login/page.tsx` que replica `references/pantallas/login.dc.html`:
  - Layout split de 2 columnas (1.05fr / 1fr) a pantalla completa, sin sidebar.
  - Columna izquierda: panel con gradiente cálido (`#F6A98E → #F2937A → #EC7E62`), dos círculos decorativos translúcidos, logo `OpenDayCare` con ícono de sol, h1 `El día de cada niño, compartido con su familia.`, subtítulo y footer `🌿 Guardería Sala Soles`.
  - Columna derecha: h2 `Iniciar sesión`, subtítulo `Ingresá para ver el día de hoy.`, campo `EMAIL` prellenado con `caro@opendaycare.com`, campo `CONTRASEÑA` con placeholder `••••••••`, link `¿Olvidaste tu contraseña?` (placeholder no funcional) y botón `Iniciar sesión`.
  - **Sin** el bloque `INGRESO COMO` (Personal / Familia).
  - Link `¿Te invitó la guardería? Activá tu cuenta` → `/activate-account`.
- Página `/activate-account` en `app/activate-account/page.tsx` que replica `references/pantallas/activar-cuenta.dc.html`:
  - Layout centrado de una columna, sin sidebar.
  - Ícono de sol en cuadro con gradiente, h1 `Bienvenida a OpenDayCare`, subtítulo.
  - Tarjeta de invitación: avatar `M` + `Te invitaron a seguir a` / `Mateo · Sala Soles`.
  - Campos `CÓDIGO DE INVITACIÓN` (`7K4P9`), `EMAIL` (`lucia.fernandez@gmail.com`) y `CREAR CONTRASEÑA` prellenados.
  - Checkbox de autorización de fotos, marcado y estático (solo visual).
  - Botón `Activar mi cuenta` y link `¿Ya tenés cuenta? Iniciar sesión` → `/login`.
- Navegación frontend:
  - Botón `Iniciar sesión` → `/` (feed existente, Spec 01).
  - Botón `Activar mi cuenta` → `/` (feed existente).
  - `Activá tu cuenta` → `/activate-account` y `Iniciar sesión` → `/login`.
- Reutilización de fuentes Fredoka/Nunito y tokens CSS de la Spec 01.
- Ambas páginas son Server Components (sin estado) salvo lo mínimo para inputs/checkbox estáticos.
- Responsive: en viewport angosto el split del login se apila en una columna.

**Out of scope (para specs futuras):**

- Autenticación real, sesiones, cookies, tokens.
- Validación de email o contraseña.
- Validación del código de invitación o del email en la activación.
- Pantalla de recuperar contraseña (`¿Olvidaste tu contraseña?` queda como placeholder `#`).
- Selector de rol `INGRESO COMO` (Personal / Familia).
- Rol de familia y `familia-feed.dc.html`.
- Persistencia de cualquier tipo.
- Crear ruta `/home`.
- Las demás pantallas del catálogo.

## Data model

Estas pantallas no introducen estructuras de datos nuevas ni persistencia. Los
valores de mock (email, código de invitación, datos de la tarjeta) van inline en
cada página como constantes locales, sin archivo `_data` nuevo.

Convenciones:

- Inputs no controlados; el checkbox de autorización lleva `defaultChecked`.
- Los links y botones son `next/link` con las rutas ya definidas en el alcance.

## Implementation plan

1. **Tokens CSS.** Agregar a `@theme` en `app/globals.css` los colores que faltan
   del template: `--color-link: #c5503a`, `--color-line-soft: #eadfd0`,
   `--color-muted-deep: #94887b`, `--color-placeholder: #b6a99b`. _Prueba: `npm run dev`,
   los tokens se resuelven en clases `text-link`, `border-line-soft`, etc._

2. **Marca / botón compartido.** Crear `components/auth/AuthSubmitLink.tsx`: un
   `next/link` con el estilo de botón degradado (`#F4977E → #EE8164`, `rounded-[15px]`,
   sombra cálida) reutilizado por las dos pantallas. _Prueba: importar sin romper._

3. **Página `/login` — estructura.** Crear `app/login/page.tsx` (Server Component)
   con `min-h-screen` y grid `lg:grid-cols-[1.05fr_1fr]`; en `< lg` se apila en una
   columna. _Prueba: se ve el layout vacío sin romper._

4. **Página `/login` — panel izquierdo.** Crear `components/auth/LoginHero.tsx`
   con el gradiente `#F6A98E → #F2937A → #EC7E62`, los dos círculos translúcidos
   decorativos, el logo `OpenDayCare` (cuadro translúcido + `SunIcon`), el h1, el
   subtítulo y el footer `🌿 Guardería Sala Soles`. Se oculta en `< lg` para evitar
   scroll largo. _Prueba: comparar contra `references/pantallas/login.dc.html`._

5. **Página `/login` — formulario.** Completar `app/login/page.tsx` con la columna
   derecha: h2 `Iniciar sesión`, subtítulo, input `EMAIL` prellenado
   (`defaultValue="caro@opendaycare.com"`), input `CONTRASEÑA` (`type="password"`,
   placeholder `••••••••`), link `¿Olvidaste tu contraseña?` (`href="#"`) y
   `AuthSubmitLink` `Iniciar sesión` → `/`. Cierra con `¿Te invitó la guardería?
   Activá tu cuenta` → `/activate-account`. Sin bloque `INGRESO COMO`. _Prueba:
   click en el botón lleva a `/` y el link lleva a `/activate-account`._

6. **Página `/activate-account` — estructura e ícono.** Crear
   `app/activate-account/page.tsx` (Server Component) centrado con
   `min-h-screen`, el cuadro con gradiente e `SunIcon`, el h1
   `Bienvenida a OpenDayCare` y el subtítulo. _Prueba: se ve sin romper._

7. **Página `/activate-account` — tarjeta y formulario.** Crear
   `components/auth/InviteCard.tsx` (avatar `M` + `Te invitaron a seguir a` +
   `Mateo · Sala Soles`) y completar la página con los inputs `CÓDIGO DE INVITACIÓN`
   (`7K4P9`), `EMAIL` (`lucia.fernandez@gmail.com`) y `CREAR CONTRASEÑA`
   (`type="password"`) prellenados, el checkbox de autorización marcado y estático
   (`defaultChecked`), `AuthSubmitLink` `Activar mi cuenta` → `/` y el link
   `¿Ya tenés cuenta? Iniciar sesión` → `/login`. _Prueba: comparar contra
   `references/pantallas/activar-cuenta.dc.html`._

8. **Verificación final.** `npm run lint` y `npx tsc --noEmit`; recorrer el flujo
   `/login` → `/activate-account` → `/login` y ambos botones hacia `/`.

## Acceptance criteria

- [ ] `http://localhost:3000/login` renderiza la pantalla de login (no 404).
- [ ] La columna izquierda muestra el gradiente cálido, los dos círculos
      decorativos, el logo `OpenDayCare`, el h1 `El día de cada niño, compartido
      con su familia.`, el subtítulo y el footer `🌿 Guardería Sala Soles`.
- [ ] La columna derecha muestra el h2 `Iniciar sesión` y el subtítulo
      `Ingresá para ver el día de hoy.`.
- [ ] El bloque `INGRESO COMO` (Personal / Familia) **no** aparece en ningún lugar.
- [ ] El campo `EMAIL` aparece prellenado con `caro@opendaycare.com`.
- [ ] El campo `CONTRASEÑA` es `type="password"` con placeholder `••••••••`.
- [ ] El link `¿Olvidaste tu contraseña?` existe y no navega (`href="#"`).
- [ ] El botón `Iniciar sesión` navega a `/`.
- [ ] El link `¿Te invitó la guardería? Activá tu cuenta` navega a `/activate-account`.
- [ ] `http://localhost:3000/activate-account` renderiza la pantalla de activación (no 404).
- [ ] La pantalla muestra el cuadro con gradiente e ícono de sol, el h1
      `Bienvenida a OpenDayCare` y el subtítulo.
- [ ] La tarjeta de invitación muestra el avatar `M` y `Mateo · Sala Soles`.
- [ ] Los campos `CÓDIGO DE INVITACIÓN` (`7K4P9`), `EMAIL`
      (`lucia.fernandez@gmail.com`) y `CREAR CONTRASEÑA` aparecen prellenados.
- [ ] El checkbox de autorización de fotos se ve marcado y no responde a click
      (estático, sin estado).
- [ ] El botón `Activar mi cuenta` navega a `/`.
- [ ] El link `¿Ya tenés cuenta? Iniciar sesión` navega a `/login`.
- [ ] Ninguna de las dos páginas muestra el `Sidebar` ni el `MobileNav`.
- [ ] En viewport `< 1024px` el split del login se apila en una columna sin desbordar.
- [ ] Los headings usan Fredoka y el cuerpo usan Nunito.
- [ ] `npm run lint` pasa sin errores.
- [ ] `npx tsc --noEmit` pasa sin errores.
- [ ] No hay errores en la consola del navegador al cargar ambas páginas.

## Decisions

- **Sí:** Rutas `/login` y `/activate-account` en inglés. Consistente con la
  convención del proyecto (código en inglés, UI en español) y con las Specs 01/02.
- **No:** `/home` como destino de los botones. El feed vive en `/`; crear `/home`
  sería una ruta extra sin propósito.
- **Sí:** Botones y links navegan de verdad (`next/link`), sin autenticación.
  `/login` ↔ `/activate-account` y ambos botones → `/`. Hace que el flujo sea
  recorrible de punta a punta.
- **No:** Auth real, cookies, sesiones ni tokens. Va en otra spec.
- **No:** Validación de email, contraseña, código de invitación o checkbox. Sin
  backend no hay nada que validar; el usuario lo pidió explícitamente para otra spec.
- **Sí:** Quitar por completo el bloque `INGRESO COMO` (Personal / Familia). El
  usuario decidió que el selector de rol no se usa; eliminarlo y no ocultarlo.
- **Sí:** Valores de mock inline en cada página (email, código, datos de la tarjeta).
  Son 4–5 strings; un archivo `_data/auth.ts` sería ceremonia innecesaria.
- **Sí:** Checkbox de autorización estático con `defaultChecked`, sin estado.
- **No:** `<input type="checkbox">` real con handler. No aporta comportamiento.
- **Sí:** Ambas páginas como Server Components. No hay estado, no hay handlers: los
  inputs son no controlados y los links son `next/link`.
- **Sí:** `components/auth/AuthSubmitLink.tsx` para el botón degradado. Los dos
  botones comparten estilo exacto; un componente evita duplicar el `linear-gradient`
  y la sombra.
- **Sí:** El panel hero del login se oculta en `< 1024px`. Con h1 de 42px y padding
  de 56px ocuparía la pantalla completa antes del formulario.
- **No:** Sidebar / MobileNav en estas pantallas. Los templates son full-screen sin
  navegación; son pantallas de entrada fuera de la sesión.
- **No:** Archivo `_data/auth.ts` (ver decisión de valores inline).
- **No:** `login.png` / `activar-cuenta.png` como referencia de verificación: no
  existen en `references/screenshots/`. La comparación es contra los `.dc.html`.

## Risks

| Riesgo                                                                                                              | Mitigación                                                                                     |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| El hero del login es alto y en mobile empuja el formulario fuera de pantalla                                      | Ocultarlo en `< 1024px` (decisión de Scope).                                                    |
| El split `1.05fr / 1fr` con `min-h-screen` en viewports cortos genera scroll vertical                            | El padding del formulario y el hero son generosos; verificar en 1366x768 y en mobile.           |
| `linear-gradient` no existe como utilidad Tailwind: hay que usar arbitrarios                                      | Usar `bg-[linear-gradient(180deg,#F4977E,#EE8164)]` y el gradiente del hero en `bg-[linear-gradient(155deg,...)]`. |
| El checkbox estático puede confundirse con uno interactivo (cursor pointer)                                       | Renderizar como `div` con el ícono de check, sin `cursor-pointer` ni atributos de input.        |

## What is **not** in this spec

- Autenticación real, sesiones, cookies o tokens.
- Validación de email, contraseña, código de invitación o del checkbox.
- Pantalla de recuperar contraseña (`¿Olvidaste tu contraseña?` queda en `#`).
- Selector de rol `INGRESO COMO` (Personal / Familia) y el concepto de roles.
- El feed de familia (`familia-feed.dc.html`) y el rol de familia.
- Cualquier persistencia (base de datos, localStorage, archivos).
- Crear la ruta `/home`.
- Las demás pantallas del catálogo.

Cada uno de esos, si llega, va en su propia spec.