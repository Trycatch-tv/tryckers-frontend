import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styles: [
    `
      .login-container {
        display: flex;
        min-height: 100vh;
      }

      .login-form {
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

      .form-input {
        width: 100%;
        padding: 12px 16px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }

      .form-input:focus {
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
        background: #007bff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .submit-btn:hover:not(:disabled) {
        background: #0056b3;
      }

      .submit-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .form-links {
        text-align: center;
        margin-top: 16px;
      }

      .forgot-link,
      .signup-link {
        color: #007bff;
        text-decoration: none;
      }

      .forgot-link:hover,
      .signup-link:hover {
        text-decoration: underline;
      }

      .login-info {
        flex: 1;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

      .error-alert {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 12px 16px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      @media (max-width: 768px) {
        .login-container {
          flex-direction: column;
        }

        .login-info {
          min-height: 200px;
        }

        .info-content h2 {
          font-size: 36px;
        }
      }
    `,
  ],
})
export class LoginPageComponent {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    this.isPosting.set(true);
    const { email = '', password = '' } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (response: any) => {
        this.isPosting.set(false);
        // Handle successful login
        this.router.navigateByUrl('/');
      },
      error: (error: any) => {
        this.isPosting.set(false);
        this.hasError.set(true);
        setTimeout(() => {
          this.hasError.set(false);
        }, 2000);
      },
    });
  }
}
