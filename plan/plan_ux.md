# Plan de mejoras UX - Tryckers Frontend

## Objetivo
Mejorar la experiencia de usuario de forma incremental, priorizando claridad en navegación, feedback inmediato, accesibilidad y rendimiento percibido.

## Fase 1 — Quick wins (1-2 días)
- Unificar rutas y textos visibles (usar `profile` como ruta canónica).
- Estandarizar estados de carga, vacío y error en vistas principales (`home`, `profile`, `cartelera`, `post`).
- Mejorar feedback de acciones críticas: login, logout, votar, crear/editar/eliminar post.
- Ajustar microcopy en botones y mensajes para mayor claridad.

## Fase 2 — Navegación y flujo de autenticación (2-3 días)
- Completar flujo `returnUrl` para redirigir al destino original tras login.
- Mostrar mensajes claros cuando una ruta requiere autenticación.
- Hacer más visibles los CTA para usuarios no autenticados.
- Evitar callejones sin salida en navegación (siempre ofrecer acción siguiente).

## Fase 3 — Formularios (2-3 días)
- Validación en tiempo real por campo (email, password, username, contenido de post).
- Mensajes de error específicos y accionables.
- Deshabilitar submit durante envío y mostrar estado de progreso.
- Confirmaciones de éxito/fallo consistentes para cada formulario.

## Fase 4 — Cartelera y lectura de posts (2-3 días)
- Reforzar jerarquía visual del ranking (posición, votos, autor, fecha).
- Mejorar legibilidad del contenido y metadatos del post.
- Optimizar acciones primarias: votar, ir al perfil, volver al listado.
- Homogeneizar comportamiento entre `profile`, `post` y `cartelera`.

## Fase 5 — Responsive y accesibilidad (3-4 días)
- Revisar y corregir navegación móvil (header, dropdowns, botones de acción).
- Asegurar contraste y tipografías legibles en todos los temas.
- Mejorar navegación por teclado (focus visible y orden lógico de tabulación).
- Agregar/ajustar `aria-label`, roles y textos alternativos cuando aplique.

## Fase 6 — Rendimiento percibido (2 días)
- Reemplazar spinners largos por skeletons en listas y tarjetas.
- Optimizar carga de imágenes (dimensiones y placeholders).
- Reducir saltos visuales (layout shifts) en cargas de datos.
- Revisar lazy loading de vistas y componentes pesados.

## Fase 7 — Consistencia visual (2-3 días)
- Unificar estilos de botones, tarjetas, espaciados y estados interactivos.
- Estandarizar iconografía y tono de mensajes del sistema.
- Documentar patrones reutilizables para nuevas pantallas.

## Fase 8 — Medición UX (1 día)
- Definir métricas clave: abandono en login, éxito de publicación, CTR en cartelera.
- Medir tiempos percibidos: carga inicial e interacción principal.
- Priorizar siguientes iteraciones con base en datos.

## Entregables por fase
- Lista de tareas técnicas por componente.
- Criterios de aceptación UX por historia.
- Validación visual y funcional antes de pasar a la siguiente fase.

## Nota de implementación
Aplicar las fases en sprints cortos (1-2 semanas), empezando por Fase 1 y Fase 2 para impacto inmediato en usabilidad.