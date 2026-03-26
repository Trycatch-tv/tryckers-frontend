import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AuthStore } from '@auth/store/auth-store';
import { NotificationService } from '@shared/services/notification.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  selectedCountry: string | null = null;

  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  authService = inject(AuthService);
  authStore = inject(AuthStore);
  private notificationService = inject(NotificationService);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    country: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
    // Marcar todos los campos como touched para mostrar errores
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
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
    const {
      name = '',
      username = '',
      country = '',
      email = '',
      password = '',
    } = this.registerForm.value;

    try {
      await new Promise<void>((resolve, reject) => {
        this.authService
          .register(name!, username!, country!, email!, password!)
          .subscribe({
            next: (isAuthenticated) => {
              if (isAuthenticated) {
                this.notificationService.success(
                  '¡Registro exitoso! Bienvenido.',
                );
                this.router.navigateByUrl('/home');
                resolve();
              } else {
                reject(new Error('Registration failed'));
              }
            },
            error: (error) => {
              reject(error);
            },
          });
      });
    } catch (error) {
      this.hasError.set(true);
      this.notificationService.error(
        'No pudimos crear tu cuenta. Revisa tus datos e intentalo nuevamente.',
      );
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

    if (fieldName === 'email' && field.errors['email']) {
      return 'Ingresa un correo valido (ejemplo@correo.com).';
    }

    return null;
  }
}
