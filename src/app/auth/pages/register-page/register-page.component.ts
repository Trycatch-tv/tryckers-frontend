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
  styleUrl: './register-page.component.css',
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
