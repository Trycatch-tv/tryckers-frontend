import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
  Router,
} from '@angular/router';
import { User } from '@auth/interfaces/user';
import { AuthService } from '@auth/services/auth.service';
import { AuthStore } from '@auth/store/auth-store';
import { NotificationService } from '@shared/services/notification.service';
import { UxMetricsService } from '@shared/services/ux-metrics.service';
import { of, throwError } from 'rxjs';
import { RegisterPageComponent } from './register-page.component';

describe('RegisterPageComponent', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let authStoreMock: {
    login: jasmine.Spy;
    logout: jasmine.Spy;
  };
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let uxMetricsSpy: jasmine.SpyObj<UxMetricsService>;
  let router: Router;

  function setup(queryParams: Record<string, string> = {}) {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'register',
    ]);
    authStoreMock = {
      login: jasmine.createSpy('login'),
      logout: jasmine.createSpy('logout'),
    };
    notificationSpy = jasmine.createSpyObj<NotificationService>(
      'NotificationService',
      ['success', 'error', 'warning', 'info'],
    );
    uxMetricsSpy = jasmine.createSpyObj<UxMetricsService>('UxMetricsService', [
      'track',
      'startTiming',
      'endTiming',
    ]);

    TestBed.configureTestingModule({
      imports: [RegisterPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AuthStore, useValue: authStoreMock },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: UxMetricsService, useValue: uxMetricsSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap(queryParams),
            },
          },
        },
      ],
    });

    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.resolveTo(true);
    spyOn(router, 'navigate').and.resolveTo(true);

    const fixture = TestBed.createComponent(RegisterPageComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  function fillValidForm(component: RegisterPageComponent) {
    component.registerForm.setValue({
      name: 'Juan Perez',
      username: 'juanp',
      country: 'colombia',
      email: 'juan@test.com',
      password: 'password123',
    });
  }

  it('reutiliza AuthStore.login tras registro exitoso y navega a /home por defecto', async () => {
    const component = setup();
    fillValidForm(component);

    authServiceSpy.register.and.returnValue(of({} as User));
    authStoreMock.login.and.resolveTo({} as never);

    await component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith(
      'Juan Perez',
      'juanp',
      'colombia',
      'juan@test.com',
      'password123',
    );
    expect(authStoreMock.login).toHaveBeenCalledWith(
      'juan@test.com',
      'password123',
    );
    expect(notificationSpy.success).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  });

  it('da prioridad a returnUrl válido tras registro y auto-login exitosos', async () => {
    const component = setup({ returnUrl: '/cartelera' });
    fillValidForm(component);

    authServiceSpy.register.and.returnValue(of({} as User));
    authStoreMock.login.and.resolveTo({} as never);

    await component.onSubmit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/cartelera');
  });

  it('limpia sesión y redirige a /auth/login si el auto-login falla tras 201 Created', async () => {
    const component = setup({ returnUrl: '/cartelera' });
    fillValidForm(component);

    authServiceSpy.register.and.returnValue(of({} as User));
    authStoreMock.login.and.rejectWith(new HttpErrorResponse({ status: 500 }));

    await component.onSubmit();

    expect(authStoreMock.logout).toHaveBeenCalled();
    expect(notificationSpy.info).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl: '/cartelera' },
    });
  });

  it('no ejecuta auto-login ni duplica toast HTTP si el registro falla', async () => {
    const component = setup();
    fillValidForm(component);

    authServiceSpy.register.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 400 })),
    );

    await component.onSubmit();

    expect(authStoreMock.login).not.toHaveBeenCalled();
    expect(notificationSpy.error).not.toHaveBeenCalled();
    expect(component.hasError()).toBeTrue();
  });

  it('impide el registro sin país y muestra mensaje específico junto al campo (AC-01, AC-02)', async () => {
    const component = setup();
    component.registerForm.setValue({
      name: 'Juan Perez',
      username: 'juanp',
      country: '',
      email: 'juan@test.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(component.getFieldError('country')).toBe('El pais es obligatorio.');
  });

  it('rechaza valores de país no canónicos (ej. CO) con mensaje específico', async () => {
    const component = setup();
    component.registerForm.setValue({
      name: 'Juan Perez',
      username: 'juanp',
      country: 'CO',
      email: 'juan@test.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(component.getFieldError('country')).toBe('Selecciona un pais valido.');
  });

  it('impide el registro cuando el username contiene espacios en blanco', async () => {
    const component = setup();
    component.registerForm.setValue({
      name: 'Juan Perez',
      username: 'juan perez',
      country: 'colombia',
      email: 'juan@test.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(component.getFieldError('username')).toBe(
      'El usuario no puede contener espacios en blanco.',
    );
  });
});
