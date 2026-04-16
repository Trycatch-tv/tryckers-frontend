# Medicion UX - KPIs y priorizacion

## KPIs implementados
- Abandono en login:
  - Eventos: `login_view`, `login_abandon`, `login_success`, `login_failure`.
  - Formula: `login_abandon_rate = login_abandon / login_view`.

- Exito de publicacion:
  - Eventos: `post_create_attempt`, `post_create_success`, `post_create_failure`.
  - Formula: `post_create_success_rate = post_create_success / post_create_attempt`.

- CTR en cartelera:
  - Eventos: `cartelera_impression` (suma de `postsCount`), `cartelera_post_click`.
  - Formula: `cartelera_ctr = cartelera_post_click / cartelera_impression_posts`.

## Tiempos percibidos instrumentados
- `perceived_initial_load`
- `perceived_cartelera_load`
- `perceived_profile_load`
- `perceived_post_load`
- `perceived_login_submit`
- `perceived_post_create_submit`

## Donde quedan los datos
- Persistencia local en `localStorage` bajo la llave `ux_metrics_events`.

## Como consultar datos en desarrollo
Desde la consola del navegador:

```javascript
window.uxMetrics.getSummary()
```

Opciones adicionales:

```javascript
window.uxMetrics.getEvents()
window.uxMetrics.clear()
```

## Priorizacion automatica (basada en datos)
`getSummary()` incluye `recommendations`, que ordena prioridades segun umbrales:
- Alta: abandono login alto o carga inicial lenta.
- Alta/Media: bajo exito al publicar.
- Media: CTR de cartelera bajo.

## Uso sugerido por iteracion
1. Recolectar datos por 1 semana.
2. Revisar `kpis` y `perceivedTimingMs`.
3. Ejecutar primero recomendaciones de prioridad alta.
4. Repetir medicion tras cada mejora para validar impacto.
