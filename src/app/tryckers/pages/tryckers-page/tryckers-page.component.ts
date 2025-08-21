import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '@auth/store/auth-store';
import { ButtonModule } from 'primeng/button';
import { DashboardPage } from '../dashboard-page/dashboard-page';

@Component({
  selector: 'app-tryckers-page',
  imports: [CommonModule, FormsModule, DashboardPage, ButtonModule, JsonPipe],
  providers: [AuthStore],
  templateUrl: './tryckers-page.component.html',
  styles: '',
})
export default class TryckersPageComponent {
  isLoggedIn = false;
  readonly authStore = inject(AuthStore);

  async inc() {
    await this.authStore.login('judlup@trycatch.tv', 'trycatch_tv23');
    console.log(this.authStore.user());
  }
}
