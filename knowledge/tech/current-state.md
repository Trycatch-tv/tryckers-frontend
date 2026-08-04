---
type: current-state
project_state: ai-assisted
generated_by: kaddo-init
template_version: 1
refined_by: architecture-agent
---

> Idioma del proyecto: **español**. Escribe este conocimiento en español. Mantén en inglés el código, los nombres de archivo, los comandos y las claves de configuración.

# tryckers-frontend — Current State

## System Overview

`tryckers-frontend` es una aplicación web SPA (Single Page Application) moderna construida con Angular 20 y TypeScript 5.8. Implementa la interfaz de usuario de la plataforma Tryckers, facilitando la interacción entre miembros de la comunidad, publicación de contenido técnico, visualización de perfiles enriquecidos con proyectos y enlaces externos, votación comunitaria y un directorio navegable de desarrolladores.

## Modules & Component Architecture

### 1. `src/app/auth/` (Módulo de Autenticación y Sesión)
- **Rutas:** `/auth/login`, `/auth/register` (lazy-loaded vía `auth.routes.ts`).
- **Guards:** `AuthenticatedGuard` (protege rutas privadas redirigiendo a `/auth/login`), `NotAuthenticatedGuard` (impide acceso a login/registro a usuarios ya autenticados).
- **Gestión de Estado:** `AuthStore` implementado con `@ngrx/signals` (`signalStore`), gestionando `isLoggedIn`, `user`, `token`, `refreshToken` con persistencia en `localStorage`.
- **Servicios:** `AuthService` para login, registro, logout y actualización de tokens.

### 2. `src/app/tryckers/` (Módulo de Perfiles y Miembros)
- **Rutas:** `/profile/:username` (página de perfil de miembro), `/home` (dashboard con lista de miembros).
- **Componentes:** Visualizador de biografía, habilidades, enlaces sociales (GitHub, LinkedIn), reproductor de pitch video y estadísticas de puntos.
- **Servicios:** `UserService` / `ProfileService` para consulta y actualización de datos de perfil y subida de avatares/banners.

### 3. `src/app/post/` (Módulo de Publicaciones y Cartelera)
- **Rutas:** `/cartelera` (feed semanal de posts destacados), `/profile/:username/post/:id` (detalle y lectura de post).
- **Componentes:** Formulario de creación/edición de publicaciones, listado con filtros, botón de votación con toggle dinámico y sección de comentarios en cascada.
- **Servicios:** `PostService`, `CommentService`, `VoteService`.

### 4. `src/app/core/` y `src/app/shared/` (Infraestructura Compartida)
- **Interceptors:** `auth.interceptor.ts` (inyecta automáticamente `Authorization: Bearer <token>`), `error.interceptor.ts` (manejo global de errores HTTP 401/403/500).
- **Layouts:** `MainLayoutComponent` (Header con navegación, sidebar, avatar de usuario y footer).
- **UI Toolkit:** PrimeNG 20 con temas adaptables y TailwindCSS 4 para estilos atómicos y responsivos.

## Dependencies and Integrations

- **Framework:** Angular v20 (`@angular/core`, `@angular/router`, `@angular/forms`, `@angular/common`).
- **Gestión de Estado Reactivo:** `@ngrx/signals` v20 y `@ngrx/store` v20.
- **Componentes UI & Iconos:** `primeng` v20, `@primeng/themes`, `primeicons` v7.
- **Diseño & Estilos:** `tailwindcss` v4, `@tailwindcss/postcss`, `postcss`.
- **Gráficos & Métricas:** `chart.js` v4.4.
- **Llamadas HTTP & Reactividad:** `rxjs` v7.8 y `fetch` / `HttpClient`.

## Data Stores & Client Persistence

- **`localStorage`:** Persistencia de `token`, `refreshToken`, `userData` y estado de login.
- **Signals en Memoria:** Estados reactivos de vistas y componentes gestionados mediante Signals nativos de Angular y SignalStore de NgRx.

## Implicit Decisions (candidates)

- **Standalone Components:** Adopción 100% de componentes Standalone sin `NgModule`s.
- **SignalStore sobre NgRx Clásico:** Elección de `@ngrx/signals` para simplificar el boilerplate de reducers y actions tradicionales.
- **Lazy Loading por Rutas:** Carga bajo demanda de componentes y rutas hijas mediante `loadComponent` y `loadChildren`.

## Open Questions

- [open] ¿Se implementará manejo de refresco automático de token en `auth.interceptor.ts` al recibir un error HTTP 401?
- [open] ¿Se agregará soporte para tema oscuro (*dark mode*) sincronizado con PrimeNG y Tailwind?

────────────────────────
Agent: architecture-agent

Produced:
knowledge/tech/current-state.md

Next:
decision-agent
roadmap-agent
────────────────────────
