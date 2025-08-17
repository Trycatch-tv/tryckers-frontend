import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    AvatarModule,
    MenuModule,
    BadgeModule,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  authService = inject(AuthService);

  // Main navigation items (center/left)
  items: MenuItem[] = [
    { label: 'Network', icon: 'pi pi-share-alt', routerLink: ['/network'] },
    { label: 'Messages', icon: 'pi pi-comments', routerLink: ['/messages'] },
    {
      label: 'Notifications',
      icon: 'pi pi-bell',
      routerLink: ['/notifications'],
    },
  ];

  // Profile dropdown items (right)
  profileItems: MenuItem[] = [
    { label: 'Profile', icon: 'pi pi-user', routerLink: ['/profile'] },
    { label: 'Settings', icon: 'pi pi-cog', routerLink: ['/settings'] },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  // Dark mode
  isDarkMode = signal(document.body.classList.contains('app-dark'));
  dropdownOpen = signal(false);

  logout() {
    this.authService.logout();
  }

  toggleDarkMode() {
    const isDark = document.body.classList.toggle('app-dark');
    this.isDarkMode.set(isDark);
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  closeDropdown() {
    this.dropdownOpen.set(false);
  }
}
