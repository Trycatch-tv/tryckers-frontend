import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styles: [
    `
      .register-container {
        display: flex;
        min-height: 100vh;
      }

      .register-form {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
        background: white;
      }

      .form-content {
        width: 100%;
        max-width: 400px;
      }

      .form-content h1 {
        font-size: 32px;
        font-weight: bold;
        color: #333;
        margin-bottom: 8px;
      }

      .form-content p {
        color: #666;
        margin-bottom: 32px;
        font-size: 16px;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-input,
      .form-select {
        width: 100%;
        padding: 12px 16px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }

      .form-select {
        background: white;
        cursor: pointer;
      }

      .form-input:focus,
      .form-select:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }

      .submit-btn {
        width: 100%;
        padding: 12px;
        font-size: 16px;
        font-weight: 600;
        color: white;
        background: #28a745;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .submit-btn:hover {
        background: #218838;
      }

      .form-links {
        text-align: center;
        margin-top: 16px;
      }

      .login-link {
        color: #007bff;
        text-decoration: none;
      }

      .login-link:hover {
        text-decoration: underline;
      }

      .register-info {
        flex: 1;
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
      }

      .info-content h2 {
        font-size: 48px;
        font-weight: bold;
        margin-bottom: 16px;
      }

      .info-content p {
        font-size: 18px;
        opacity: 0.9;
      }

      @media (max-width: 768px) {
        .register-container {
          flex-direction: column;
        }

        .register-info {
          min-height: 200px;
        }

        .info-content h2 {
          font-size: 36px;
        }
      }
    `,
  ],
})
export class RegisterPageComponent {
  name = signal<string>('');
  email = signal<string>('');
  value = signal<string>('');
  password = signal<string>('');

  selectedCountry: any = null;

  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  authService = inject(AuthService);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    country: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const {
      name = '',
      country = '',
      email = '',
      password = '',
    } = this.registerForm.value;

    this.authService
      .register(name!, country!, email!, password!)
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/');
          return;
        }
        this.hasError.set(true);
        setTimeout(() => {
          this.hasError.set(false);
        }, 2000);
      });
  }
}
