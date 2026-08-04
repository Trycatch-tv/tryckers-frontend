---
type: module-context
scope: module
module_id: frontend
parent_system: tryckers
project_state: ai-assisted
generated_by: kaddo-init
template_version: 1
refined_by: module-context-agent
---

> Idioma del proyecto: **español**. Escribe este conocimiento en español. Mantén en inglés el código, los nombres de archivo, los comandos y las claves de configuración.

# Module Context — tryckers-frontend

## Module Identity

- **Nombre:** `tryckers-frontend`
- **ID de Módulo:** `frontend`
- **Sistema Padre:** `tryckers`
- **Rol:** Single Page Application (SPA) para clientes web.
- **Propósito:** Proveer una experiencia de usuario interactiva, reactiva y moderna para los desarrolladores de la comunidad Tryckers, permitiendo la autenticación, visualización y edición de perfiles profesionales, exploración del directorio de miembros, publicación y lectura de posts técnicos, votación y cartelera semanal de contenidos destacados.

## Responsibility

El módulo `tryckers-frontend` es responsable exclusivo de:
1. **Experiencia de Usuario e Interfaz Visual:** Renderizado de componentes UI accesibles y responsivos utilizando Angular 20, PrimeNG 20 y TailwindCSS 4.
2. **Gestión de Estado del Cliente:** Manejo reactivo de la sesión de usuario y tokens de autenticación mediante `AuthStore` implementado con `@ngrx/signals` (SignalStore).
3. **Control de Rutas y Navegación:** Protección de rutas públicas (`/auth/**`) y privadas (`/cartelera`, `/profile/:username`, `/settings`) a través de guardias funcionales (`AuthenticatedGuard`, `NotAuthenticatedGuard`).
4. **Intercepción y Consumo de APIs:** Inyección automática del token `Authorization: Bearer <token>` en peticiones salientes (`auth.interceptor.ts`) y captura unificada de errores HTTP (`error.interceptor.ts`).
5. **Persistencia Local de Sesión:** Sincronización segura del estado de autenticación en `localStorage` del navegador.

## Boundaries

- **Pertenece a este módulo:**
  - Componentes de interfaz, páginas, layouts (`MainLayoutComponent`), pipes y directivas de Angular.
  - SignalStores de UI y estado local de cliente.
  - Clientes HTTP / servicios frontend tipados con TypeScript.
  - Archivos de configuración de estilos (Tailwind, PostCSS, temas de PrimeNG).
- **NO pertenece a este módulo (pertenece al core backend o infraestructura):**
  - Generación, firma y verificación criptográfica de JWTs.
  - Hasheo de contraseñas (bcrypt) y lógica de validación de credenciales.
  - Persistencia relacional en base de datos PostgreSQL.
  - Almacenamiento físico de archivos multimedia o interacción directa con buckets S3.
  - Reglas de negocio de autorización global y endpoints REST.

## Exposed Interfaces

- **Rutas de Navegación del Navegador:**
  - `/auth/login` y `/auth/register`: Formularios de autenticación de usuario.
  - `/home` (o `/dashboard`): Directorio y catálogo de miembros con filtros.
  - `/cartelera`: Vista semanal de publicaciones destacadas y votadas.
  - `/profile/:username`: Perfil técnico público de un miembro (información, enlaces, proyectos, pitch video).
  - `/profile/:username/post/:id`: Vista de lectura y comentarios de una publicación.
  - `/settings`: Edición de perfil, carga de avatar/banner y configuración de cuenta.

## Dependencies

- **Servicios Backend:** `tryckers-backend` API REST expuesta en `http://localhost:8080/api/v1` (o URL definida en `src/environments/environment.ts`).
- **Librerías Core:**
  - Angular Core & Common v20
  - `@ngrx/signals` v20 y `@ngrx/store` v20
  - PrimeNG v20 y `@primeng/themes`
  - TailwindCSS v4 y `@tailwindcss/postcss`
  - RxJS v7.8
  - Chart.js v4.4 para visualizaciones y gráficos de perfil
- **Navegador Web:** APIs de `localStorage`, `sessionStorage`, `Fetch / XMLHttpRequest` y manipulación del DOM.

## Consumers

- **Usuarios Finales:** Miembros de la comunidad (desarrolladores de software, reclutadores técnicos, líderes de comunidad y visitantes).

## Local Rules

1. **Angular Standalone:** Todos los componentes, directivas y pipes deben ser *Standalone* (sin `NgModule`s heredados).
2. **SignalStore para Estado:** Toda nueva gestión de estado global o de módulo debe utilizar `@ngrx/signals` (`signalStore`, `withState`, `withMethods`, `withHooks`).
3. **Manejo de Formularios:** Utilizar Reactive Forms (`FormBuilder`, `FormGroup`, `Validators`) con validaciones en cliente alineadas a las reglas del backend.
4. **Protección de Rutas:** Toda nueva ruta protegida debe registrarse con `canMatch: [AuthenticatedGuard]`.
5. **Estilos:** Priorizar clases utilitarias de TailwindCSS y componentes temáticos de PrimeNG, evitando CSS global no estructurado.

## Risks

1. **Desincronización de DTOs:** Cambios en los nombres de campos en la API de Go sin actualización simultánea de las interfaces TypeScript en `@interfaces/` o `@auth/interfaces/`.
2. **Fuga de Tokens:** Almacenamiento de tokens en `localStorage` expone vulnerabilidad a ataques XSS si se inyecta código malicioso externo.
3. **Renderizado de Medios Locales:** Ruptura de enlaces de imágenes al migrar del backend local (`/uploads`) a URLs firmadas de S3 si el frontend no procesa URLs absolutas adecuadamente.

## Open Questions

- [open] ¿Se implementará Angular SSR (Server-Side Rendering con Angular Universal / Hydration) para optimizar el SEO de perfiles públicos y posts?
- [open] ¿Se migrará el almacenamiento de tokens de autenticación de `localStorage` a cookies `HttpOnly` enviadas por el backend?

────────────────────────
Agent: module-context-agent

Produced:
knowledge/module/module-context.md

Next:
architecture-agent
────────────────────────
