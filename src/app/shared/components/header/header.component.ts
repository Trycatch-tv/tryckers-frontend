import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AuthStore } from '@auth/store/auth-store';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authService = inject(AuthService);
  authStore = inject(AuthStore);
  dropdownOpen = signal(false);
  isDarkMode = signal(false);

  constructor() {
    // Inicializar el tema desde localStorage
    const savedTheme = localStorage.getItem('theme');
    if (
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.enableDarkMode();
    }
  }

  toggleTheme() {
    if (this.isDarkMode()) {
      this.enableLightMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode() {
    document.documentElement.classList.add('dark-theme');
    document.body.classList.add('dark-theme');
    this.isDarkMode.set(true);
    localStorage.setItem('theme', 'dark');
  }

  private enableLightMode() {
    document.documentElement.classList.remove('dark-theme');
    document.body.classList.remove('dark-theme');
    this.isDarkMode.set(false);
    localStorage.setItem('theme', 'light');
  }

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
