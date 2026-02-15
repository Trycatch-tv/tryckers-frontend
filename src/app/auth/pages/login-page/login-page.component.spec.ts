import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPageComponent } from './login-page.component';
import { AuthStore } from '../../store/auth-store';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { setupTestBedWithRouter } from '../../../../test-helpers';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authStoreMock: any;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authStoreMock = {
      login: jasmine.createSpy('login').and.returnValue(Promise.resolve()),
      isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(false),
      user: jasmine.createSpy('user').and.returnValue(null),
      token: jasmine.createSpy('token').and.returnValue(''),
    };

    const { providers, routerSpy } = setupTestBedWithRouter();
    routerMock = routerSpy;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginPageComponent],
      providers: [
        ...providers,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthStore, useValue: authStoreMock },
        AuthService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    
    // Override the injected services with mocks
    component.authStore = authStoreMock;
    component.router = routerMock;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with email and password controls', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.get('email')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
  });

  it('should call authStore.login on form submit', async () => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(authStoreMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should navigate to home on successful login', async () => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should set hasError signal on login failure', async () => {
    authStoreMock.login.and.returnValue(Promise.reject(new Error('Invalid credentials')));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'wrong',
    });

    await component.onSubmit();

    expect(component.hasError()).toBeTruthy();
  });

  it('should have empty form on initialization', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    component.loginForm.patchValue({
      email: '',
      password: '',
    });

    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@example.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('123');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();

    passwordControl?.setValue('123456');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
  });

  it('should set hasError on invalid form submit', async () => {
    component.loginForm.patchValue({
      email: '',
      password: '',
    });

    await component.onSubmit();

    expect(component.hasError()).toBeTruthy();
  });

  it('should set isPosting to false after successful submission', async () => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(component.isPosting()).toBeFalsy();
  });

  it('should set isPosting to false after failed submission', async () => {
    authStoreMock.login.and.returnValue(Promise.reject(new Error('Error')));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(component.isPosting()).toBeFalsy();
  });
});
