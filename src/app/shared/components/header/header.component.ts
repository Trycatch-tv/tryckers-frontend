import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AuthStore } from '@auth/store/auth-store';
import { NotificationService } from '@shared/services/notification.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authService = inject(AuthService);
  authStore = inject(AuthStore);
  notificationService = inject(NotificationService);
  router = inject(Router);
  dropdownOpen = signal(false);
  mobileMenuOpen = signal(false);
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

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeDropdown();
        this.closeMobileMenu();
      });
  }

  get profileLink(): string[] {
    const username = this.authStore.user()?.username;
    if (username) {
      return ['/profile', username];
    }
    return ['/home'];
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
    this.authStore.logout();
    this.notificationService.info('Sesión cerrada correctamente.');
    this.closeDropdown();
    this.closeMobileMenu();
    this.router.navigate(['/home']);
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
    if (this.mobileMenuOpen()) {
      this.dropdownOpen.set(false);
    }
  }

  closeDropdown() {
    this.dropdownOpen.set(false);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeDropdown();
    this.closeMobileMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }

    if (!target.closest('.user-menu')) {
      this.closeDropdown();
    }
  }
}
