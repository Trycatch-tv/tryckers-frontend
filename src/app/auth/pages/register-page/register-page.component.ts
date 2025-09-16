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

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  name = signal<string>('');
  username = signal<string>('');
  email = signal<string>('');
  value = signal<string>('');
  password = signal<string>('');

  selectedCountry: any = null;

  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  authService = inject(AuthService);
  authStore = inject(AuthStore);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    country: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
    console.log('Form submitted');
    console.log('Form valid:', this.registerForm.valid);
    console.log('Form values:', this.registerForm.value);
    console.log('Form errors:', this.registerForm.errors);

    // Marcar todos los campos como touched para mostrar errores
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      console.log('Form is invalid');
      // Log specific field errors
      Object.keys(this.registerForm.controls).forEach((key) => {
        const control = this.registerForm.get(key);
        if (control?.errors) {
          console.log(`${key} errors:`, control.errors);
        }
      });

      this.hasError.set(true);
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

    console.log('Sending registration request with:', {
      name,
      username,
      country,
      email,
    });

    try {
      await new Promise<void>((resolve, reject) => {
        this.authService
          .register(name!, username!, country!, email!, password!)
          .subscribe({
            next: (isAuthenticated) => {
              console.log('Registration response:', isAuthenticated);
              if (isAuthenticated) {
                console.log('Registration successful, redirecting to home');
                this.router.navigateByUrl('/');
                resolve();
              } else {
                reject(new Error('Registration failed'));
              }
            },
            error: (error) => {
              console.error('Registration error:', error);
              reject(error);
            },
          });
      });
    } catch (error) {
      console.error('Registration failed:', error);
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
    } finally {
      this.isPosting.set(false);
    }
  }
}
