import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="settings-page ui-card">
      <h1>Configuración</h1>
      <p>
        Esta sección estará disponible próximamente. Aquí podrás ajustar
        preferencias de cuenta, notificaciones y privacidad.
      </p>
    </section>
  `,
  styles: [
    `
      .settings-page {
        max-width: 840px;
        margin: 1rem auto;
        padding: 1.25rem;
      }

      h1 {
        margin: 0 0 0.5rem;
        color: var(--ui-text);
      }

      p {
        margin: 0;
        color: var(--ui-text-muted);
      }
    `,
  ],
})
export default class SettingsPageComponent {}
