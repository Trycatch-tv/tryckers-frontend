import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AuthStore } from '@auth/store/auth-store';
import { getSafeReturnUrl } from '@auth/utils/return-url';
import {
  COUNTRIES,
  isValidCanonicalCountry,
} from '@shared/constants/countries';
import { NotificationService } from '@shared/services/notification.service';
import { UxMetricsService } from '@shared/services/ux-metrics.service';
import { firstValueFrom } from 'rxjs';

function validCountryValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value as string | null | undefined;
  if (!value) {
    return null;
  }
  return isValidCanonicalCountry(value) ? null : { invalidCountry: true };
}

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent implements OnInit {
  selectedCountry: string | null = null;
  readonly countries = COUNTRIES;

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

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    country: ['', [Validators.required, validCountryValidator]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    const safeReturnUrl = getSafeReturnUrl(
      this.route.snapshot.queryParamMap.get('returnUrl'),
    );
    this.returnUrl.set(safeReturnUrl);
  }

  async onSubmit(): Promise<void> {
    this.uxMetrics.track('register_submit_attempt');
    // Marcar todos los campos como touched para mostrar errores
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.uxMetrics.track('register_validation_error');
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
    this.uxMetrics.startTiming('register-submit');
    const {
      name = '',
      username = '',
      country = '',
      email = '',
      password = '',
    } = this.registerForm.value;

    let registrationSucceeded = false;

    try {
      await firstValueFrom(
        this.authService.register(
          name!,
          username!,
          country!,
          email!,
          password!,
        ),
      );
      registrationSucceeded = true;

      // Reutilizar el flujo de login existente para iniciar una sesión válida
      await this.authStore.login(email!, password!);

      this.uxMetrics.track('register_success');
      this.uxMetrics.endTiming('register-submit', 'perceived_register_submit', {
        success: true,
      });
      this.notificationService.success('¡Registro exitoso! Bienvenido.');
      await this.router.navigateByUrl(this.returnUrl() ?? '/home');
    } catch (error) {
      if (registrationSucceeded) {
        // La cuenta fue creada, pero falló el auto-login: limpiar cualquier estado parcial y redirigir a login
        this.authStore.logout();
        this.uxMetrics.track('register_autologin_failure');
        this.uxMetrics.endTiming(
          'register-submit',
          'perceived_register_submit',
          {
            success: true,
            autoLoginSuccess: false,
          },
        );
        this.notificationService.info(
          'Tu cuenta fue creada correctamente. Inicia sesión para continuar.',
        );
        const safeReturnUrl = this.returnUrl();
        await this.router.navigate(['/auth/login'], {
          queryParams: safeReturnUrl ? { returnUrl: safeReturnUrl } : undefined,
        });
        return;
      }

      this.uxMetrics.track('register_failure');
      this.uxMetrics.endTiming('register-submit', 'perceived_register_submit', {
        success: false,
      });
      this.hasError.set(true);
      // Evitar notificación duplicada si errorInterceptor ya mostró el error HTTP
      if (!(error instanceof HttpErrorResponse)) {
        this.notificationService.error(
          'No pudimos crear tu cuenta. Revisa tus datos e intentalo nuevamente.',
        );
      }
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
    } finally {
      this.isPosting.set(false);
    }
  }

  isFieldInvalid(
    fieldName: 'name' | 'username' | 'country' | 'email' | 'password',
  ): boolean {
    const field = this.registerForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  getFieldError(
    fieldName: 'name' | 'username' | 'country' | 'email' | 'password',
  ): string | null {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.errors || !(field.dirty || field.touched)) {
      return null;
    }

    if (field.errors['required']) {
      const labels = {
        name: 'El nombre completo',
        username: 'El nombre de usuario',
        country: 'El pais',
        email: 'El correo',
        password: 'La contraseña',
      };
      return `${labels[fieldName]} es obligatorio.`;
    }

    if (field.errors['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      if (fieldName === 'name') {
        return `El nombre debe tener al menos ${minLength} caracteres.`;
      }
      if (fieldName === 'username') {
        return `El usuario debe tener al menos ${minLength} caracteres.`;
      }
      if (fieldName === 'password') {
        return `La contraseña debe tener al menos ${minLength} caracteres.`;
      }
      return `Este campo debe tener al menos ${minLength} caracteres.`;
    }

    if (fieldName === 'country' && field.errors['invalidCountry']) {
      return 'Selecciona un pais valido.';
    }

    if (fieldName === 'email' && field.errors['email']) {
      return 'Ingresa un correo valido (ejemplo@correo.com).';
    }

    return null;
  }
}
