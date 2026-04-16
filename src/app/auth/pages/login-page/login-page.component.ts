import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AuthStore } from '@auth/store/auth-store';
import { NotificationService } from '@shared/services/notification.service';
import { UxMetricsService } from '@shared/services/ux-metrics.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);
  route = inject(ActivatedRoute);
  returnUrl = signal<string | null>(null);

  authService = inject(AuthService);
  authStore = inject(AuthStore);
  private notificationService = inject(NotificationService);
  private uxMetrics = inject(UxMetricsService);
  private loginSuccess = false;
  private hasSubmitAttempt = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    this.uxMetrics.track('login_view');
    const safeReturnUrl = this.getSafeReturnUrl(
      this.route.snapshot.queryParamMap.get('returnUrl'),
    );
    this.returnUrl.set(safeReturnUrl);

    if (safeReturnUrl) {
      this.notificationService.info('Inicia sesión para continuar.');
    }
  }

  ngOnDestroy(): void {
    if (!this.loginSuccess) {
      this.uxMetrics.track('login_abandon', {
        hasSubmitAttempt: this.hasSubmitAttempt,
      });
    }
  }

  async onSubmit() {
    this.loginForm.markAllAsTouched();
    this.hasSubmitAttempt = true;

    if (this.loginForm.invalid) {
      this.uxMetrics.track('login_validation_error');
      this.hasError.set(true);
      this.notificationService.warning(
        'Revisa los campos resaltados para continuar.',
      );
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    this.isPosting.set(true);
    this.uxMetrics.startTiming('login-submit');
    const { email = '', password = '' } = this.loginForm.value;

    try {
      await this.authStore.login(email!, password!);
      this.isPosting.set(false);
      this.loginSuccess = true;
      this.uxMetrics.track('login_success');
      this.uxMetrics.endTiming('login-submit', 'perceived_login_submit', {
        success: true,
      });
      this.notificationService.success('¡Inicio de sesión exitoso!');
      this.router.navigateByUrl(this.returnUrl() ?? '/home');
    } catch (error) {
      console.error('Login failed:', error);
      this.isPosting.set(false);
      this.uxMetrics.track('login_failure');
      this.uxMetrics.endTiming('login-submit', 'perceived_login_submit', {
        success: false,
      });
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

  isFieldInvalid(fieldName: 'email' | 'password'): boolean {
    const field = this.loginForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  getFieldError(fieldName: 'email' | 'password'): string | null {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors || !(field.dirty || field.touched)) {
      return null;
    }

    if (field.errors['required']) {
      return fieldName === 'email'
        ? 'El correo es obligatorio.'
        : 'La contraseña es obligatoria.';
    }

    if (fieldName === 'email' && field.errors['email']) {
      return 'Ingresa un correo valido (ejemplo@correo.com).';
    }

    if (fieldName === 'password' && field.errors['minlength']) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }

    return null;
  }
}
