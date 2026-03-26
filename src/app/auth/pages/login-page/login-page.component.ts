import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
export class LoginPageComponent implements OnInit {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);
  route = inject(ActivatedRoute);
  returnUrl = signal<string | null>(null);

  authService = inject(AuthService);
  authStore = inject(AuthStore);
  private notificationService = inject(NotificationService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    const safeReturnUrl = this.getSafeReturnUrl(
      this.route.snapshot.queryParamMap.get('returnUrl'),
    );
    this.returnUrl.set(safeReturnUrl);

    if (safeReturnUrl) {
      this.notificationService.info('Inicia sesión para continuar.');
    }
  }

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
      this.router.navigateByUrl(this.returnUrl() ?? '/home');
    } catch (error) {
      console.error('Login failed:', error);
      this.isPosting.set(false);
      this.hasError.set(true);
      this.notificationService.error(
        'No pudimos iniciar sesión. Verifica tus credenciales.',
      );
      // El interceptor ya muestra el mensaje de error HTTP
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
    }
  }

  private getSafeReturnUrl(returnUrl: string | null): string | null {
    if (!returnUrl || !returnUrl.startsWith('/')) {
      return null;
    }

    if (returnUrl.startsWith('//') || returnUrl.includes('://')) {
      return null;
    }

    if (returnUrl.startsWith('/auth')) {
      return null;
    }

    return returnUrl;
  }
}
