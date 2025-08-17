import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  authService = inject(AuthService);

  // Dark mode
  isDarkMode = signal(false);
  dropdownOpen = signal(false);

  constructor() {
    // Inicializar dark mode desde localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
      document.body.classList.add('app-dark');
      document.documentElement.classList.add('app-dark');
    }
    this.isDarkMode.set(savedDarkMode);
  }

  logout() {
    this.authService.logout();
  }

  toggleDarkMode() {
    const isDark = document.body.classList.toggle('app-dark');
    document.documentElement.classList.toggle('app-dark', isDark);
    this.isDarkMode.set(isDark);

    // Guardar preferencia en localStorage
    localStorage.setItem('darkMode', isDark.toString());
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  closeDropdown() {
    this.dropdownOpen.set(false);
  }
}
