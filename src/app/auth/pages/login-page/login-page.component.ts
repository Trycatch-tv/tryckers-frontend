import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AuthStore } from '@auth/store/auth-store';
import { NotificationService } from '@shared/services/notification.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  authService = inject(AuthService);
  authStore = inject(AuthStore);
  private notificationService = inject(NotificationService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      this.notificationService.warning(
        'Por favor, completa todos los campos correctamente.',
      );
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    this.isPosting.set(true);
    const { email = '', password = '' } = this.loginForm.value;

    try {
      await this.authStore.login(email!, password!);
      this.isPosting.set(false);
      this.notificationService.success('¡Inicio de sesión exitoso!');
      this.router.navigateByUrl('/');
    } catch (error) {
      console.error('Login failed:', error);
      this.isPosting.set(false);
      this.hasError.set(true);
      // El interceptor ya muestra el mensaje de error HTTP
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
    }
  }
}
