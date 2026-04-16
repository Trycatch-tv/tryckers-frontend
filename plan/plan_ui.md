# Plan de mejoras UI - Tryckers Frontend

## Objetivo
Mejorar navegación, consistencia visual y usabilidad en perfiles, con foco en control de acciones por usuario, escalabilidad de publicaciones (paginado), robustez de dark mode y navegación funcional del dropdown del navbar.

## Hallazgos actuales (análisis)
- En perfil se muestran acciones de edición/eliminación y botón Crear sin distinguir si el perfil pertenece al usuario autenticado.
- El listado de posts del perfil no tiene paginado, lo que afectará rendimiento percibido y escaneabilidad al crecer el contenido.
- El dark mode es parcial: conviven variables globales con colores hardcodeados y estilos duplicados, generando contrastes inconsistentes.
- El dropdown del navbar contiene enlaces no resueltos con la configuración de rutas actual (por ejemplo, perfil sin username dinámico y configuración sin ruta dedicada).

## Alcance de este plan
Incluye diseño funcional + cambios UI en:
- Navbar y dropdown de usuario
- Perfil de usuario (acciones visibles + listado de publicaciones)
- Sistema de tema (dark mode)
- Reglas de consistencia visual asociadas a estas vistas

No incluye (en esta iteración):
- Rediseño completo de identidad visual
- Refactor integral de todo el sistema de estilos de la app
- Paginado en otras pantallas fuera del perfil

## Plan por fases

### Fase 1 - Navegación correcta en dropdown (impacto alto, bajo esfuerzo)
Objetivo:
- Asegurar que todas las opciones del dropdown llevan a una ruta válida y esperada.

Tareas:
- Conectar opción Perfil a la ruta con username real del usuario autenticado.
- Definir comportamiento de Configuración:
  - Opción A: crear ruta/página settings mínima (placeholder funcional).
  - Opción B: ocultar temporalmente el ítem hasta existir ruta.
- Cerrar dropdown y menú móvil al navegar para evitar estados colgados.
- Añadir estado activo visual para la opción actual cuando aplique.

Criterios de aceptación:
- Desde desktop y mobile, cada ítem del dropdown navega correctamente.
- No existen enlaces del dropdown que redirijan por fallback inesperado.
- El menú siempre se cierra tras navegar o hacer logout.

---

### Fase 2 - Permisos visuales en perfil (impacto alto, bajo esfuerzo)
Objetivo:
- Mostrar acciones de creación/edición solo cuando el perfil visto es propio.

Tareas:
- Calcular bandera isOwnProfile comparando username del perfil cargado vs usuario autenticado.
- Ocultar botón flotante Crear en perfiles ajenos.
- Ocultar botones Editar/Eliminar en tarjetas de posts cuando no es perfil propio.
- Ajustar microcopy del estado vacío:
  - Perfil propio: invitar a crear publicación.
  - Perfil ajeno: mensaje informativo sin CTA de creación.

Criterios de aceptación:
- En perfil propio aparecen Crear, Editar y Eliminar.
- En perfil ajeno no aparecen controles de modificación.
- No cambia el acceso a Leer post ni a votar.

---

### Fase 3 - Paginado de publicaciones en perfil (impacto alto, esfuerzo medio)
Objetivo:
- Mejorar navegabilidad y rendimiento percibido cuando hay muchos posts.

Tareas:
- Definir estrategia de paginado:
  - Preferida: paginado en backend (page, limit, total).
  - Alternativa temporal: paginado client-side si API aún no expone metadatos.
- Implementar estado de paginación en perfil:
  - currentPage, pageSize, totalItems/totalPages.
- Renderizar controles UI de paginado accesibles:
  - Anterior/Siguiente, página actual, deshabilitados en límites.
- Mantener consistencia de estados loading/empty/error por página.
- Persistir query param page para compartir URL del estado actual (opcional recomendado).

Criterios de aceptación:
- Usuario puede navegar entre páginas de posts sin romper layout.
- Controles reflejan límites correctamente.
- La interacción mantiene accesibilidad por teclado y focus visible.

---

### Fase 4 - Ajuste integral de dark mode (impacto alto, esfuerzo medio)
Objetivo:
- Eliminar inconsistencias de contraste y hacer el tema oscuro predecible.

Tareas:
- Consolidar tokens de color en variables CSS (fondo, superficie, texto, borde, interacción, estado).
- Reemplazar colores hardcodeados en componentes objetivo por variables del sistema.
- Revisar contraste de texto/botones/enlaces/inputs en dark mode.
- Estandarizar estados hover/focus/disabled para ambos temas.
- Validar visualmente:
  - Header + dropdown
  - Perfil (cards, sidebar, modal, acciones)
  - Botones primarios/secundarios/destructivos

Criterios de aceptación:
- Contraste legible en dark mode en las vistas intervenidas.
- No hay “parches” visuales con tonos distintos para el mismo tipo de componente.
- El cambio de tema no provoca saltos ni estilos rotos.

---

### Fase 5 - QA UX y cierre (impacto medio, bajo esfuerzo)
Objetivo:
- Garantizar estabilidad visual y funcional del paquete completo.

Tareas:
- Pruebas manuales desktop/mobile en rutas:
  - home, cartelera, profile propio, profile ajeno, post detalle.
- Checklist de accesibilidad básica (teclado, focus, labels relevantes).
- Ajustes finales de espaciado/microcopy detectados en QA.
- Actualizar documentación breve de patrones aplicados.

Criterios de aceptación:
- Flujo de navegación sin callejones en header/dropdown.
- Reglas de visibilidad por propietario cumplidas.
- Paginado funcional y estable.
- Dark mode consistente en el alcance definido.

## Priorización recomendada
1. Dropdown navbar (Fase 1)
2. Ocultar crear/editar en perfil ajeno (Fase 2)
3. Paginado de posts en perfil (Fase 3)
4. Dark mode (Fase 4)
5. QA y cierre (Fase 5)

## Riesgos y mitigaciones
- Riesgo: API de posts no soporte paginado.
  - Mitigación: implementar client-side temporal y dejar interfaz preparada para backend pagination.
- Riesgo: inconsistencias dark mode fuera del alcance actual.
  - Mitigación: limitar alcance y documentar pendientes para fase siguiente.
- Riesgo: datos incompletos de usuario autenticado para resolver username.
  - Mitigación: fallback seguro y manejo explícito de estado no disponible.

## Estimación
- Fase 1: 0.5 día
- Fase 2: 0.5 día
- Fase 3: 1 a 1.5 días
- Fase 4: 1 a 1.5 días
- Fase 5: 0.5 día

Total estimado: 3.5 a 4.5 días de trabajo incremental.

## Orden de implementación propuesto
1. Navbar dropdown
2. Reglas de visibilidad por perfil propio/ajeno
3. Paginado en perfil
4. Normalización dark mode
5. QA final y ajustes
