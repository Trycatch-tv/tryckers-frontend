import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);

  dropdownOpen = signal(false);

  toggleDropdown() {
    this.dropdownOpen.update((val) => !val);
  }

  closeDropdown() {
    this.dropdownOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.closeDropdown();
  }

  ngOnInit(): void {
    this.authService.authStatus();
  }
}
