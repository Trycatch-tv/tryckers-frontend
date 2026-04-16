# Patrones UI Reutilizables - Tryckers

## Objetivo
Mantener consistencia visual y de interacción en nuevas pantallas usando el sistema definido en `src/styles.scss`.

## Tokens base (globales)
Usar variables CSS de `:root` para colores, bordes, radios, sombras y transiciones:
- `--ui-bg`, `--ui-bg-muted`
- `--ui-border`, `--ui-border-strong`
- `--ui-text`, `--ui-text-muted`
- `--ui-primary`, `--ui-primary-hover`
- `--ui-radius-sm`, `--ui-radius-md`, `--ui-radius-lg`
- `--ui-shadow-sm`, `--ui-shadow-md`
- `--ui-transition`

## Componentes utilitarios globales
Clases listas para reutilizar:
- `.ui-card`: base para tarjetas y contenedores con borde/sombra/radio.
- `.ui-btn`: base para acciones interactivas.
- `.ui-btn-primary`: acción principal (CTA).
- `.ui-btn-danger`: acción destructiva.
- `.ui-chip`: etiquetas compactas y metadatos rápidos.
- `.ui-meta`: texto secundario de soporte.
- `.skeleton`: placeholder de carga con shimmer.

## Reglas de consistencia
1. Botones:
- Primario: solo una acción principal por bloque visual.
- Secundario: usar `.ui-btn` normal.
- Destructivo: usar `.ui-btn-danger` y confirmar acción.

2. Tarjetas:
- Base visual con `.ui-card`.
- Espaciado interno uniforme (16-24px).
- Evitar mezclar radios/sombras arbitrarias fuera de tokens.

3. Estados interactivos:
- Hover/focus/active deben usar `--ui-transition`.
- Focus visible obligatorio para teclado.
- Evitar estados sin feedback visual.

4. Iconografía y texto:
- Tono en español neutro y accionable.
- Verbos consistentes: `Leer post`, `Ver perfil`, `Votar`, `Quitar voto`, `Cerrar sesión`.

## Estados de carga y error
- Carga: priorizar `.skeleton` frente a spinners largos.
- Error: mensaje claro + acción de recuperación (`Reintentar`).
- Vacío: explicar contexto + siguiente acción sugerida.

## Checklist para nuevas pantallas
- Usa tokens globales, no colores hardcodeados.
- Reutiliza `.ui-card` y `.ui-btn`.
- Incluye estado de carga skeleton.
- Incluye estado vacío y error con CTA.
- Verifica focus visible y navegación por teclado.
- Mantén microcopy consistente con el sistema.
