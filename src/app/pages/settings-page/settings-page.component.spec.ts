import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AuthStore } from '@auth/store/auth-store';
import { Trycker } from '@tryckers/interfaces';
import { TryckersService } from '@tryckers/services/tryckers-service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import SettingsPageComponent from './settings-page.component';

describe('SettingsPageComponent (country & profile updates)', () => {
  let tryckersServiceSpy: jasmine.SpyObj<TryckersService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userSignal = signal<Trycker | null>(null);
  let authStoreMock: {
    user: typeof userSignal;
    setUser: jasmine.Spy;
  };

  function setup(initialUser: Trycker) {
    userSignal = signal<Trycker | null>(initialUser);
    authStoreMock = {
      user: userSignal,
      setUser: jasmine.createSpy('setUser'),
    };
    tryckersServiceSpy = jasmine.createSpyObj<TryckersService>(
      'TryckersService',
      ['updateProfile'],
    );
    notificationSpy = jasmine.createSpyObj<NotificationService>(
      'NotificationService',
      ['success', 'error', 'warning', 'info'],
    );
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'setUserData',
    ]);

    TestBed.configureTestingModule({
      imports: [SettingsPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthStore, useValue: authStoreMock },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TryckersService, useValue: tryckersServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    });

    const fixture = TestBed.createComponent(SettingsPageComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  const baseUser = {
    id: 'u-1',
    name: 'Ana Dev',
    username: 'anadev',
    email: 'ana@test.com',
    country: '',
    role: 'member',
    points: 0,
    headline: 'Engineer',
    bio: 'Bio inicial',
  } as Trycker;

  it('no asigna CO por defecto cuando el usuario no tiene país y omite country al actualizar bio (AC-06, AC-07)', async () => {
    const component = setup({ ...baseUser, country: '' });

    expect(component.formData.country).toBe('');

    component.formData.bio = 'Nueva biografía sin país';
    tryckersServiceSpy.updateProfile.and.resolveTo({
      ...baseUser,
      bio: 'Nueva biografía sin país',
    });

    await component.saveProfile();

    expect(tryckersServiceSpy.updateProfile).toHaveBeenCalledTimes(1);
    const sentPayload = tryckersServiceSpy.updateProfile.calls.mostRecent().args[0];
    expect(sentPayload.bio).toBe('Nueva biografía sin país');
    expect('country' in sentPayload).toBeFalse();
    expect(notificationSpy.success).toHaveBeenCalled();
  });

  it('conserva país canónico válido del usuario y permite actualizar bio sin errores (AC-04, AC-05)', async () => {
    const component = setup({ ...baseUser, country: 'colombia' });

    expect(component.formData.country).toBe('colombia');

    component.formData.bio = 'Bio actualizada con país válido';
    tryckersServiceSpy.updateProfile.and.resolveTo({
      ...baseUser,
      country: 'colombia',
      bio: 'Bio actualizada con país válido',
    });

    await component.saveProfile();

    const sentPayload = tryckersServiceSpy.updateProfile.calls.mostRecent().args[0];
    expect(sentPayload.country).toBe('colombia');
    expect(sentPayload.bio).toBe('Bio actualizada con país válido');
  });

  it('permite seleccionar o cambiar país usando valor canónico (AC-08)', async () => {
    const component = setup({ ...baseUser, country: '' });

    component.formData.country = 'mexico';
    tryckersServiceSpy.updateProfile.and.resolveTo({
      ...baseUser,
      country: 'mexico',
    });

    await component.saveProfile();

    const sentPayload = tryckersServiceSpy.updateProfile.calls.mostRecent().args[0];
    expect(sentPayload.country).toBe('mexico');
  });

  it('muestra mensaje específico de validación del backend cuando falla el guardado (AC-10)', async () => {
    const component = setup({ ...baseUser, country: 'colombia' });

    tryckersServiceSpy.updateProfile.and.rejectWith(
      new HttpErrorResponse({
        status: 400,
        error: { error: 'país inválido', code: 400 },
      }),
    );

    await component.saveProfile();

    expect(component.validationError).toBe('país inválido');
    expect(notificationSpy.error).not.toHaveBeenCalled();
  });
});
