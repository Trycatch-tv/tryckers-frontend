---
type: adr
status: accepted
date: 2026-08-04
governed_code:
  - src/app/auth/store/**
  - src/app/**/store/**
---

# ADR-001 — Adopción de NgRx SignalStore para Gestión de Estado Reactivo

## Context
La aplicación SPA requiere gestionar el estado global y de sesión del usuario (tokens de autenticación, datos del perfil autenticado, estado de login) de forma reactiva y predecible.

## Options Considered
1. **Servicios de Angular con BehaviorSubject (RxJS clásico):** Requiere manejo manual de suscripciones, desuscripciones y operadores de multicasting.
2. **NgRx Store Tradicional (Actions, Reducers, Effects, Selectors):** Alta rigidez y gran cantidad de código boilerplate para la escala del proyecto.
3. **`@ngrx/signals` (SignalStore):** Integración nativa con Angular Signals, API concisa (`withState`, `withMethods`, `withHooks`), tipado estricto y reactividad sin overhead.

## Decision
Se adopta `@ngrx/signals` (`SignalStore`) como el estándar oficial de gestión de estado para `tryckers-frontend`:
- El estado de autenticación se centraliza en `AuthStore` (`src/app/auth/store/auth-store.ts`).
- Los métodos asíncronos actualizan el estado mediante `patchState(store, ...)`.
- La sincronización con `localStorage` se realiza dentro de los métodos del store.

## Consequences
- **Positivas:**
  - Código limpio, legible y con mínimo boilerplate.
  - Interoperabilidad transparente con los Signals nativos de Angular 20 en plantillas HTML.
  - Facilidad de testeo unitario.
- **Negativas / Mitigaciones:**
  - Requiere que los desarrolladores se familiaricen con la API de NgRx SignalStore.

## Related Capabilities
- Identity and Access Management (IAM) / Client-side Authentication and Token Handling
