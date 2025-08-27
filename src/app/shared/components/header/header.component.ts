import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AuthStore } from '@auth/store/auth-store';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styles: [
    `
      .header {
        background: white;
        border-bottom: 1px solid #e0e0e0;
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 16px;
      }

      .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
      }

      .logo-link {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        text-decoration: none;
      }

      .logo-link:hover {
        opacity: 0.8;
      }

      .nav {
        display: flex;
        gap: 32px;
      }

      .nav-link {
        color: #666;
        text-decoration: none;
        font-weight: 500;
      }

      .nav-link:hover {
        color: #333;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .search-input {
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
      }

      .theme-toggle {
        padding: 8px;
        border: 1px solid #ccc;
        background: white;
        border-radius: 4px;
        cursor: pointer;
      }

      .theme-toggle:hover {
        background: #f5f5f5;
      }

      .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
      }

      .btn-outline {
        background: white;
        color: #333;
        border: 1px solid #ccc;
      }

      .btn-outline:hover {
        background: #f5f5f5;
      }

      .btn-primary {
        background: #007bff;
        color: white;
      }

      .btn-primary:hover {
        background: #0056b3;
      }

      .user-menu {
        position: relative;
      }

      .user-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: 1px solid #ccc;
        background: white;
        border-radius: 4px;
        cursor: pointer;
      }

      .avatar {
        width: 24px;
        height: 24px;
        background: #ccc;
        border-radius: 50%;
      }

      .dropdown-menu {
        position: absolute;
        right: 0;
        top: 100%;
        margin-top: 4px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        min-width: 160px;
      }

      .dropdown-item {
        display: block;
        padding: 8px 16px;
        color: #333;
        text-decoration: none;
      }

      .dropdown-item:hover {
        background: #f5f5f5;
      }

      .dropdown-button {
        width: 100%;
        text-align: left;
        border: none;
        background: none;
        cursor: pointer;
      }

      @media (max-width: 768px) {
        .nav {
          display: none;
        }

        .search-container {
          display: none;
        }

        .username {
          display: none;
        }
      }
    `,
  ],
})
export class HeaderComponent {
  authService = inject(AuthService);
  authStore = inject(AuthStore);
  dropdownOpen = signal(false);

  logout() {
    this.authService.logout();
    this.authStore.logout();
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  closeDropdown() {
    this.dropdownOpen.set(false);
  }
}
