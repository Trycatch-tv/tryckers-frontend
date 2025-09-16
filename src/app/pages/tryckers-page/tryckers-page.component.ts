import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@auth/store/auth-store';
import { ButtonModule } from 'primeng/button';
import { DashboardPage } from '../../tryckers/pages/dashboard-page/dashboard-page';

@Component({
  selector: 'app-tryckers-page',
  imports: [CommonModule, FormsModule, RouterLink, DashboardPage, ButtonModule],
  templateUrl: './tryckers-page.component.html',
  styles: [],
})
export default class TryckersPageComponent implements OnInit {
  readonly authStore = inject(AuthStore);

  ngOnInit() {
    console.log(
      'TryckersPage initialized, isLoggedIn:',
      this.authStore.isLoggedIn(),
    );
  }
}
