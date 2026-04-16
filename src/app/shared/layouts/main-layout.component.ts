import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="layout-wrapper">
      <!-- Header/Navbar -->
      <header class="header-section">
        <app-header />
      </header>

      <!-- Main Content Area -->
      <main class="main-content">
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="footer-section">
        <app-footer />
      </footer>
    </div>
  `,
  styles: [
    `
      .layout-wrapper {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 0;
        padding: 0;
      }

      .header-section {
        position: sticky;
        top: 0;
        z-index: 1000;
        background: var(--ui-surface);
        box-shadow: 0 2px 4px
          color-mix(in srgb, var(--ui-text) 12%, transparent);
        width: 100%;
      }

      .main-content {
        flex: 1;
        padding: 20px;
        margin: 0;
        width: 100%;
        overflow-x: hidden;
        background: var(--ui-bg-muted);
      }

      :host-context(.dark-theme) .header-section {
        background: var(--ui-surface-muted);
        box-shadow: 0 2px 4px color-mix(in srgb, #000 45%, transparent);
      }

      .footer-section {
        margin-top: auto;
        width: 100%;
      }
    `,
  ],
})
export class MainLayoutComponent {}
