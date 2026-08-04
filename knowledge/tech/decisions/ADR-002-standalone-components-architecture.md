---
type: adr
status: accepted
date: 2026-08-04
governed_code:
  - src/app/**/*.ts
---

# ADR-002 — Adopción de Arquitectura Standalone Components en Angular

## Context
Angular introdujo el modelo *Standalone* para desacoplar componentes, directivas y pipes de los módulos `NgModule` tradicionales, facilitando la modularización fina, lazy-loading a nivel de componente y optimización del bundle final.

## Options Considered
1. **Arquitectura basada en `NgModule` (Angular legacy):** Requiere declarar cada componente en un módulo intermedio, aumentando el acoplamiento y la complejidad de mantenimiento.
2. **Arquitectura Standalone pura:** Todos los componentes declaran directamente sus dependencias (`imports: [...]`) y son cargados de forma independiente.

## Decision
Se adopta una arquitectura 100% Standalone para todo el código de `tryckers-frontend`:
- Ningún nuevo componente, directiva o pipe utilizará `NgModule`.
- El arranque de la aplicación se ejecuta con `bootstrapApplication(AppComponent, appConfig)`.
- El enrutamiento aprovecha `loadComponent` para *route-level code splitting*.

## Consequences
- **Positivas:**
  - Reducción del tamaño del bundle JavaScript gracias a un tree-shaking más efectivo.
  - Mejor modularidad y claridad de dependencias por componente.
- **Negativas / Mitigaciones:**
  - Cada componente debe importar explícitamente los módulos de PrimeNG o directivas de Angular que utilice.

## Related Capabilities
- User Experience / Component Modularization and Lazy Loading
