---
type: codebase
project_state: ai-assisted
generated_by: kaddo-init
template_version: 1
refined_by: architecture-agent
---

> Idioma del proyecto: **español**. Escribe este conocimiento en español. Mantén en inglés el código, los nombres de archivo, los comandos y las claves de configuración.

# tryckers-frontend — Codebase Map

## Repository Structure

```
tryckers-frontend/
├── .angular/                # Caché del compilador de Angular
├── .kaddo/                  # Metadatos y configuración de Kaddo (rol: module)
├── knowledge/               # Artefactos de conocimiento (tech, module, delivery)
├── public/                  # Assets públicos estáticos (iconos, imágenes por defecto)
├── src/
│   ├── app/
│   │   ├── auth/            # Rutas, componentes (Login, Register), guards, servicios y AuthStore
│   │   ├── components/      # Componentes UI reutilizables (Navbar, Sidebar, Cards, Dialogs)
│   │   ├── core/            # Interceptores HTTP (Auth, Error) y servicios de infraestructura
│   │   ├── interfaces/      # Tipos y contratos TypeScript globales
│   │   ├── pages/           # Vistas principales (TryckersPage, SettingsPage)
│   │   ├── post/            # Vistas y componentes de Posts, Cartelera y Comentarios
│   │   ├── shared/          # Layouts compartidos (MainLayoutComponent), pipes y utilitarios
│   │   ├── tryckers/        # Vistas y componentes de Perfil de usuario y directorio
│   │   ├── app.config.ts    # Configuración de providers de Angular (Router, Interceptors, PrimeNG)
│   │   ├── app.routes.ts    # Catálogo principal de rutas de la aplicación
│   │   └── app.ts           # Componente raíz Standalone (AppComponent)
│   ├── environments/        # Configuración de endpoints de API por entorno (dev, prod)
│   ├── index.html           # HTML raíz de la SPA
│   ├── main.ts              # Punto de entrada de bootstrapping (`bootstrapApplication`)
│   └── styles.css           # Hoja de estilos global, temas de PrimeNG y directivas Tailwind
├── angular.json             # Configuración del workspace de Angular CLI
├── package.json             # Dependencias npm y scripts de ejecución
├── tailwind.config.js       # Configuración de temas, paleta y extensiones Tailwind
└── tsconfig.json            # Configuración de compilación TypeScript y path aliases (@auth, @core, etc.)
```

## Entry Points

- **Bootstrap Entry Point:** `src/main.ts`
  - Ejecuta `bootstrapApplication(AppComponent, appConfig)` iniciando la SPA Standalone.
- **Configuración de Providers:** `src/app/app.config.ts`
  - Configura `provideRouter(routes, withComponentInputBinding())`, `provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))` y temas de PrimeNG.
- **Enrutamiento Principal:** `src/app/app.routes.ts`

## How to Run

### Requisitos Previos
- Node.js 20+ y npm 10+
- Backend `tryckers-backend` ejecutándose en `http://localhost:8080`

### Comandos de Ejecución
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en http://localhost:4200
npm start
# o sin abrir navegador automáticamente:
npm run start-no-browser

# Compilar para producción
npm run build
```

## How to Test

```bash
# Ejecutar suite de pruebas unitarias con Karma / Jasmine
npm test
```

## Open Questions

- [open] ¿Se agregará Playwright o Cypress para pruebas End-to-End (E2E) de flujos críticos de autenticación y publicación?

────────────────────────
Agent: architecture-agent

Produced:
knowledge/tech/codebase.md

Next:
decision-agent
roadmap-agent
────────────────────────
