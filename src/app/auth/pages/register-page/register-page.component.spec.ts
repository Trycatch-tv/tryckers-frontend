import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { RegisterPageComponent } from './register-page.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthStore } from '../../store/auth-store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let authStoreMock: any;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['register']);
    routerMock = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    authStoreMock = {
      setUser: jasmine.createSpy('setUser'),
      setToken: jasmine.createSpy('setToken'),
      isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, RegisterPageComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: AuthStore, useValue: authStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    
    // Override the injected services with mocks
    component.authService = authServiceMock;
    component.router = routerMock;
    component.authStore = authStoreMock;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize register form with required fields', () => {
    expect(component.registerForm).toBeTruthy();
    expect(component.registerForm.get('email')).toBeTruthy();
    expect(component.registerForm.get('password')).toBeTruthy();
    expect(component.registerForm.get('name')).toBeTruthy();
    expect(component.registerForm.get('username')).toBeTruthy();
    expect(component.registerForm.get('country')).toBeTruthy();
  });

  it('should call authService.register on form submit', async () => {
    authServiceMock.register.and.returnValue(of(true));

    component.registerForm.patchValue({
      name: 'Test User',
      username: 'testuser',
      country: 'US',
      email: 'test@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalledWith(
      'Test User',
      'testuser',
      'US',
      'test@example.com',
      'password123'
    );
  });

  it('should navigate to home on successful registration', async () => {
    authServiceMock.register.and.returnValue(of(true));

    component.registerForm.patchValue({
      name: 'Test User',
      username: 'testuser',
      country: 'US',
      email: 'test@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should set hasError signal on registration failure', async () => {
    authServiceMock.register.and.returnValue(
      throwError(() => new Error('Email already exists'))
    );

    component.registerForm.patchValue({
      name: 'Test User',
      username: 'testuser',
      country: 'US',
      email: 'existing@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(component.hasError()).toBeTruthy();
  });

  it('should have empty form on initialization', () => {
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('name')?.value).toBe('');
    expect(component.registerForm.get('username')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    component.registerForm.patchValue({
      name: '',
      username: '',
      email: '',
      password: '',
      country: '',
    });

    expect(component.registerForm.invalid).toBeTruthy();
  });

  it('should mark all fields as touched on invalid submit', async () => {
    component.registerForm.patchValue({
      name: '',
      username: '',
      email: '',
      password: '',
      country: '',
    });

    await component.onSubmit();

    expect(component.registerForm.touched).toBeTruthy();
  });

  it('should set isPosting to false after submission', async () => {
    authServiceMock.register.and.returnValue(of(true));

    component.registerForm.patchValue({
      name: 'Test User',
      username: 'testuser',
      country: 'US',
      email: 'test@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(component.isPosting()).toBeFalsy();
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@example.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('123');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();

    passwordControl?.setValue('123456');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
  });

  it('should validate name minimum length', () => {
    const nameControl = component.registerForm.get('name');
    nameControl?.setValue('ab');
    expect(nameControl?.hasError('minlength')).toBeTruthy();

    nameControl?.setValue('abcde');
    expect(nameControl?.hasError('minlength')).toBeFalsy();
  });

  it('should validate username minimum length', () => {
    const usernameControl = component.registerForm.get('username');
    usernameControl?.setValue('ab');
    expect(usernameControl?.hasError('minlength')).toBeTruthy();

    usernameControl?.setValue('abc');
    expect(usernameControl?.hasError('minlength')).toBeFalsy();
  });

  it('should set hasError on invalid form submit', async () => {
    component.registerForm.patchValue({
      name: '',
      username: '',
      email: '',
      password: '',
      country: '',
    });

    await component.onSubmit();

    expect(component.hasError()).toBeTruthy();
  });
});
