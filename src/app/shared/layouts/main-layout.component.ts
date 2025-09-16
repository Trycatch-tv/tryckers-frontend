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
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        width: 100%;
      }

      .main-content {
        flex: 1;
        padding: 20px;
        margin: 0;
        width: 100%;
        overflow-x: hidden;
        background: #f8f9fa;
      }

      .footer-section {
        margin-top: auto;
        width: 100%;
      }
    `,
  ],
})
export class MainLayoutComponent {}
