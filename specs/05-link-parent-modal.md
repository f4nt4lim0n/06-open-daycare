# SPEC 05 — Modal "Vincular padre" desde el perfil del niño

> **Estado:** Approved
> **Depende de:** Spec 02 (kids-list-and-profile) — reutiliza `/kids/[id]`, `app/_data/kids.ts` y tokens CSS
> **Fecha:** 2026-10-20
> **Objetivo:** Al hacer click en "Vincular otro padre" del perfil del niño abre un modal calco de vincular-padre.dc.html que agrega un padre con estado PENDIENTE tras validar nombre y email.

## Scope

**In:**

- Convertir `app/kids/[id]/page.tsx` en Client Component con estado `isLinkParentOpen` para abrir/cerrar el modal.
- Link `Vincular otro padre` del perfil abre el modal (deja de ser `href="#"`).
- Componente `components/kids/LinkParentModal.tsx` calco de `references/pantallas/vincular-padre.dc.html`:
  - Overlay de fondo oscuro translúcido, centrado, con la tarjeta `max-w-[480px]` fondo `#FBF4EC`, borde `#ECE0D0`, radio 24px y sombra `0 20px 50px -24px rgba(63,54,46,.35)`.
  - Header: título `Vincular padre` (Fredoka 18px) + subtítulo `a {fullName del niño}` + botón X (34px, fondo `#F0E6D8`) que cierra el modal.
  - Aviso azul (`#E3ECFB`, ícono info `#4E72C8`): `Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de {firstName}.`
  - Inputs `NOMBRE DEL PADRE/MADRE` (`Ej. Diego Fernández`) y `EMAIL` (`correo@ejemplo.com`), editables y controlados.
  - Selector de `PARENTESCO` single-select con 3 botones pill: `Mamá` (seleccionado por defecto, estilo `#CCD8F4`/`#4E72C8`), `Papá` y `Tutor/a`.
  - Bloque `CÓDIGO DE INVITACIÓN` con mock fijo `7K4P9` y `Vence en 7 días` (fondo `#FBF1D6`, borde dashed `#E6D08A`).
  - Botón `Enviar invitación` con gradiente `#F4977E → #EE8164`.
- Validación client-side: al enviar se exige nombre no vacío y email no vacío con formato básico; si falta algo se muestra un mensaje de error bajo el campo correspondiente y el modal no se cierra.
- Al enviar válido: cierra el modal y agrega el padre nuevo a `linkedParents` con `status: 'pending'` en estado de React (en memoria, se pierde al recargar), reflejándose en la sección `PADRES VINCULADOS` con badge `PENDIENTE`.
- Escape y click en el overlay cierran el modal (descartando lo escrito).
- Cierre de scroll del body mientras el modal está abierto.
- Iconos nuevos en `components/shared/icons.tsx`: `CloseIcon` (X), `InfoIcon`, `PlusIcon`, `SendIcon` — solo los que falten.
- `npm run lint` y `npx tsc --noEmit` sin errores.

**Out of scope (para specs futuras):**

- Backend, base de datos, persistencia: el padre agregado se pierde al recargar.
- Envío real de correo ni generación real de código de invitación.
- Validación de email duplicado contra padres ya vinculados.
- Pantalla `vincular-padre` como ruta independiente (es solo modal).
- Edición o eliminación de padres ya vinculados.
- Pantalla `agregar-nino.dc.html` y `resumen-dia.dc.html`.
- El badge `VINCULAR` de `KidCard` en `/kids` (sigue siendo visual, no abre el modal).
- Las demás pantallas del catálogo.

## Data model

Cambios sobre `app/_data/kids.ts` (ya existente, Spec 02). No hay persistencia:
el estado vive en `useState` dentro de `/kids/[id]`.

```ts
// Parent role options for the link-parent modal (UI strings, ordered as in the template).
export const PARENT_ROLES = ['Mamá', 'Papá', 'Tutor/a'] as const;
export type ParentRole = (typeof PARENT_ROLES)[number];

// LinkedParent gains a required email (captured by the modal, shown nowhere yet).
export interface LinkedParent {
  name: string;
  initial: string;
  role: string; // "Mamá" | "Papá" | "Tutor/a"
  status: ParentStatus;
  email: string; // "diego@ejemplo.com"
  avatarBg: string;
  avatarColor: string;
}
```

Convenciones:

- El `initial` del padre nuevo es la primera letra de `name` (uppercase).
- `avatarBg`/`avatarColor` del padre nuevo usan la paleta de familia existente:
  `#C9B6E8` / `#7B5FC0` (fijo por ahora, sin backend no hay asignación real).
- `role` se guarda con el string en español del botón seleccionado, consistente
  con los datos existentes de la Spec 02.
- Al hacer `email` obligatorio, hay que agregarle `email` a los padres mock ya
  existentes en `kids.ts` (p. ej. `lucia.fernandez@gmail.com`,
  `diego.fernandez@gmail.com`, etc.) para que siga compilando.

## Implementation plan

1. **Iconos nuevos.** Agregar a `components/shared/icons.tsx` los iconos que
   falten de: `CloseIcon` (X), `InfoIcon` (círculo con i), `PlusIcon` (+),
   `SendIcon` (avión de papel). _Prueba: importar desde un componente._

2. **Data model.** Actualizar `app/_data/kids.ts`: agregar `email` a los 8
   padres mock existentes, agregar `email` como obligatorio en `LinkedParent`
   y crear `PARENT_ROLES` / `ParentRole`. _Prueba: `npx tsc --noEmit`._

3. **Modal — estructura.** Crear `components/kids/LinkParentModal.tsx` (Client
   Component) con props `{ kidFullName, kidFirstName, onClose, onInvite }`.
   Overlay fijo `inset-0` con fondo `rgba(63,54,46,.45)`, flex centrado, y la
   tarjeta calco del template (header con X, aviso azul). _Prueba: montarlo
   hardcodeado `open` en el perfil y se ve igual que el template._

4. **Modal — formulario.** Completar el modal con inputs controlados
   (`name`, `email`), selector single-select `PARENT_ROLES` (default `Mamá`)
   y bloque `CÓDIGO DE INVITACIÓN` mock fijo `7K4P9`. _Prueba: escribir en los
   inputs y cambiar de parentesco responde._

5. **Modal — validación y envío.** Implementar `handleSubmit`: valida nombre
   no vacío y email con regex básica `/^\S+@\S+\.\S+$/`; muestra error bajo el
   campo inválido y no envía. Si es válido, llama `onInvite({ name, email,
   role })` y cierra. _Prueba: enviar vacío aparecen errores; enviar válido
   cierra el modal._

6. **Wire del perfil.** Convertir `app/kids/[id]/page.tsx` en Client Component:
   estado `isLinkParentOpen`, lista local de padres inicializada con los del
   kid, link `Vincular otro padre` abre el modal, `onInvite` agrega el padre
   nuevo con `status: 'pending'` y colores de familia. Escape y click en
   overlay cierran. _Prueba: abrir, invitar a "Ana Pérez", aparece con badge
   PENDIENTE en `PADRES VINCULADOS`._

7. **Cierre de scroll y accesibilidad.** `document.body.style.overflow =
   'hidden'` mientras el modal está abierto (limpiar al cerrar), botón X con
   `aria-label="Cerrar"`. _Prueba: con el modal abierto el body no scrollea._

8. **Verificación final.** Comparar `/kids/mateo-fernandez` + modal abierto
   contra `references/pantallas/vincular-padre.dc.html`. `npm run lint`,
   `npx tsc --noEmit`, sin errores en consola.

## Acceptance criteria

- [x] `http://localhost:3000/kids/mateo-fernandez` muestra el link
      `Vincular otro padre` (ya no es placeholder `#`).
- [x] El link `Vincular otro padre` abre el modal sobre el perfil, sin navegar.
- [x] El modal calco de `vincular-padre.dc.html`: header `Vincular padre` /
      `a Mateo Fernández`, botón X, aviso azul, 2 inputs, 3 botones de
      parentesco, bloque `7K4P9` y botón `Enviar invitación`.
- [x] El subtítulo del header usa el `fullName` del niño visitado (no
      hardcodeado): en `/kids/sofia-mendez` dice `a Sofía Méndez`.
- [x] El botón X cierra el modal.
- [x] Click en el overlay oscuro cierra el modal.
- [x] Presionar Escape cierra el modal.
- [x] Con el modal abierto el body no tiene scroll; al cerrar se restaura.
- [x] `Mamá` viene seleccionado por defecto; clickear `Papá` o `Tutor/a` cambia
      la selección (single-select).
- [x] Los campos `NOMBRE` y `EMAIL` son editables.
- [x] Enviar con nombre vacío muestra error bajo el campo nombre y el modal no
      se cierra.
- [x] Enviar con email vacío o inválido (p. ej. `abc`) muestra error bajo el
      campo email y el modal no se cierra.
- [x] Enviar con nombre y email válidos cierra el modal y agrega el padre a
      `PADRES VINCULADOS` con badge `PENDIENTE`.
- [x] El padre agregado muestra inicial, nombre, rol seleccionado y badge
      `PENDIENTE` (colores `#F7E7A6`/`#9A7B1E`).
- [x] El bloque de código siempre muestra `7K4P9` y `Vence en 7 días` (mock
      fijo).
- [x] El texto del aviso azul incluye el `firstName` del niño visitado.
- [x] Recargar la página quita al padre agregado (sin persistencia, esperado).
- [x] `npm run lint` pasa sin errores.
- [x] `npx tsc --noEmit` pasa sin errores.
- [x] No hay errores en la consola del navegador al abrir, enviar y cerrar el
      modal.

## Decisions

- **Sí:** Modal (overlay con `useState`), no ruta nueva. Lo pidió el usuario
  explícitamente; el template es una tarjeta que encaja como modal sobre el
  perfil.
- **Sí:** Al enviar válido se agrega el padre con `status: 'pending'` en estado
  de React. Opción (b) del usuario: da flujo completo sin persistencia.
- **Sí:** Validar nombre y email no vacíos + regex básica de email en
  client-side. El usuario pidió exigirlos "para probar", sin backend.
- **No:** Backend, base de datos ni persistencia. El padre agregado se pierde al
  recargar; decisión explícita del usuario.
- **Sí:** Código de invitación mock fijo `7K4P9` con "Vence en 7 días", igual
  que `activar-cuenta.dc.html`. Confirmado por el usuario: es a modo de prueba.
- **Sí:** `email` obligatorio en `LinkedParent`. Pedido del usuario; obliga a
  agregar emails a los 8 padres mock de la Spec 02.
- **Sí:** Convertir `app/kids/[id]/page.tsx` a Client Component. El modal
  necesita estado; se pasa el mínimo hacia abajo.
- **Sí:** `PARENT_ROLES` como array constante en `_data/kids.ts` con los
  strings en español del template (`Mamá`, `Papá`, `Tutor/a`). El `role`
  existente de la Spec 02 ya guarda strings en español; consistencia.
- **Sí:** Colores fijos de avatar para el padre nuevo (`#C9B6E8`/`#7B5FC0`).
  Sin backend no hay asignación real; se itera si hace falta.
- **No:** Validar email duplicado contra padres ya vinculados. Fuera de scope,
  anotado en Scope.
- **No:** Abrir el modal desde el badge `VINCULAR` de `KidCard`. Solo desde el
  perfil, como pidió el usuario.
- **No:** Reusar `AuthSubmitLink` (Spec 03) para `Enviar invitación`. El estilo
  es prácticamente igual pero el elemento es `button` con handlers, no un
  `next/link`; forzarlo complicaría el componente.

## Risks

| Riesgo                                                        | Mitigación                                                                             |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Convertir `kids/[id]/page.tsx` a Client Component puede romper el render de Spec 02 | Mover solo el sidebar derecho a un componente cliente (`LinkedParentsPanel`) si el calco se complica; el resto puede seguir server. |
| Cerrar scroll del body y no restaurarlo al navegar            | Restaurar `overflow` en el cleanup del `useEffect` del modal.                          |
| Escape/overlay cerrando mientras se escribe (estado perdido)  | Comportamiento aceptado y pedido: se cierra descartando lo escrito.                     |
| Regex de email demasiado permisiva/restrictiva                | Regex básica `/^\S+@\S+\.\S+$/` documentada; sin backend no se valida entregabilidad.    |
| `email` obligatorio rompe tipado de datos mock existentes     | Paso 2 del plan agrega emails a los 8 padres antes de tocar el tipo.                    |

## What is **not** in this spec

- Backend, base de datos ni persistencia: el padre agregado se pierde al recargar.
- Envío real de correo ni generación real de código de invitación.
- Validación de email duplicado contra padres ya vinculados.
- Ruta independiente `/kids/[id]/link-parent` (es solo modal).
- Edición o eliminación de padres ya vinculados.
- Pantallas `agregar-nino` y `resumen-dia`.
- Abrir el modal desde el badge `VINCULAR` de `KidCard`.
- Las demás pantallas del catálogo.

Cada uno de esos, si llega, va en su propia spec.