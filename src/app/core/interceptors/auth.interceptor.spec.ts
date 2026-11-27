import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AuthStore } from '@auth/store/auth-store';
import { NotificationService } from '@shared/services/notification.service';
import { environment } from 'src/environments/environment';
import {
  authInterceptor,
  resetAuthInterceptorStateForTests,
} from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let authStore: InstanceType<typeof AuthStore>;
  let router: Router;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    localStorage.clear();
    resetAuthInterceptorStateForTests();
    notificationSpy = jasmine.createSpyObj<NotificationService>(
      'NotificationService',
      ['success', 'error', 'warning', 'info'],
    );

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        AuthService,
        AuthStore,
        { provide: NotificationService, useValue: notificationSpy },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    authStore = TestBed.inject(AuthStore);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
  });

  afterEach(() => {
    httpMock.verify();
    resetAuthInterceptorStateForTests();
    localStorage.clear();
  });

  it('adjunta Bearer token y renueva sincronizando AuthStore al recibir 401', () => {
    authStore.syncTokens('expired-token', 'valid-refresh');

    let responseBody: unknown = null;
    http.get(`${environment.baseUrl}/cartelera`).subscribe((res) => {
      responseBody = res;
    });

    const firstReq = httpMock.expectOne(`${environment.baseUrl}/cartelera`);
    expect(firstReq.request.headers.get('Authorization')).toBe(
      'Bearer expired-token',
    );
    firstReq.flush(
      { error: 'token invalid' },
      { status: 401, statusText: 'Unauthorized' },
    );

    const refreshReq = httpMock.expectOne(
      `${environment.baseUrl}/refresh-token`,
    );
    expect(refreshReq.request.method).toBe('POST');
    refreshReq.flush({
      token: 'new-access-token',
      refresh_token: 'new-refresh-token',
    });

    const retryReq = httpMock.expectOne(`${environment.baseUrl}/cartelera`);
    expect(retryReq.request.headers.get('Authorization')).toBe(
      'Bearer new-access-token',
    );
    retryReq.flush([{ id: 'post-1', title: 'Top post' }]);

    expect(responseBody).toEqual([{ id: 'post-1', title: 'Top post' }]);
    expect(authService.token()).toBe('new-access-token');
    expect(authService.refreshTokenValue()).toBe('new-refresh-token');
    expect(authStore.token()).toBe('new-access-token');
    expect(authStore.refreshToken()).toBe('new-refresh-token');
    expect(authStore.isLoggedIn()).toBeTrue();
    expect(localStorage.getItem('token')).toBe('new-access-token');
    expect(localStorage.getItem('refreshToken')).toBe('new-refresh-token');
  });

  it('conserva la sesión cuando el refresh es exitoso pero la petición reintentada devuelve 500', () => {
    authStore.syncTokens('expired-token', 'valid-refresh');

    let receivedStatus = 0;
    http.get(`${environment.baseUrl}/cartelera`).subscribe({
      error: (err) => {
        receivedStatus = err.status;
      },
    });

    const firstReq = httpMock.expectOne(`${environment.baseUrl}/cartelera`);
    firstReq.flush(
      { error: 'token invalid' },
      { status: 401, statusText: 'Unauthorized' },
    );

    const refreshReq = httpMock.expectOne(
      `${environment.baseUrl}/refresh-token`,
    );
    refreshReq.flush({
      token: 'new-access-token',
      refresh_token: 'new-refresh-token',
    });

    const retryReq = httpMock.expectOne(`${environment.baseUrl}/cartelera`);
    retryReq.flush(
      { error: 'internal error' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(receivedStatus).toBe(500);
    expect(authService.token()).toBe('new-access-token');
    expect(authStore.token()).toBe('new-access-token');
    expect(authStore.isLoggedIn()).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(notificationSpy.error).not.toHaveBeenCalled();
  });

  it('no destruye la sesión cuando /refresh-token devuelve error temporal 503 o error de red', () => {
    authStore.syncTokens('expired-token', 'valid-refresh');

    let receivedStatus = 0;
    http.get(`${environment.baseUrl}/cartelera`).subscribe({
      error: (err) => {
        receivedStatus = err.status;
      },
    });

    const firstReq = httpMock.expectOne(`${environment.baseUrl}/cartelera`);
    firstReq.flush(
      { error: 'token invalid' },
      { status: 401, statusText: 'Unauthorized' },
    );

    const refreshReq = httpMock.expectOne(
      `${environment.baseUrl}/refresh-token`,
    );
    refreshReq.flush(
      { error: 'service unavailable' },
      { status: 503, statusText: 'Service Unavailable' },
    );

    expect(receivedStatus).toBe(503);
    expect(authService.token()).toBe('expired-token');
    expect(authService.refreshTokenValue()).toBe('valid-refresh');
    expect(authStore.isLoggedIn()).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(notificationSpy.error).not.toHaveBeenCalled();
  });

  it('ejecuta una única renovación compartida ante múltiples 401 simultáneos', () => {
    authStore.syncTokens('expired-token', 'valid-refresh');

    let resA: unknown = null;
    let resB: unknown = null;
    http.get(`${environment.baseUrl}/users`).subscribe((res) => (resA = res));
    http
      .get(`${environment.baseUrl}/cartelera`)
      .subscribe((res) => (resB = res));

    const reqA = httpMock.expectOne(`${environment.baseUrl}/users`);
    const reqB = httpMock.expectOne(`${environment.baseUrl}/cartelera`);

    reqA.flush({ error: 'expired' }, { status: 401, statusText: 'Unauthorized' });
    reqB.flush({ error: 'expired' }, { status: 401, statusText: 'Unauthorized' });

    const refreshReqs = httpMock.match(`${environment.baseUrl}/refresh-token`);
    expect(refreshReqs.length).toBe(1);
    refreshReqs[0].flush({
      token: 'shared-new-token',
      refresh_token: 'shared-new-refresh',
    });

    const retryA = httpMock.expectOne(`${environment.baseUrl}/users`);
    const retryB = httpMock.expectOne(`${environment.baseUrl}/cartelera`);
    expect(retryA.request.headers.get('Authorization')).toBe(
      'Bearer shared-new-token',
    );
    expect(retryB.request.headers.get('Authorization')).toBe(
      'Bearer shared-new-token',
    );

    retryA.flush([{ id: 'u1' }]);
    retryB.flush([{ id: 'p1' }]);

    expect(resA).toEqual([{ id: 'u1' }]);
    expect(resB).toEqual([{ id: 'p1' }]);
  });

  it('evita ciclos infinitos si la petición reintentada devuelve 401 nuevamente', () => {
    authStore.syncTokens('expired-token', 'valid-refresh');

    let receivedStatus = 0;
    http.get(`${environment.baseUrl}/cartelera`).subscribe({
      error: (err) => {
        receivedStatus = err.status;
      },
    });

    const firstReq = httpMock.expectOne(`${environment.baseUrl}/cartelera`);
    firstReq.flush(
      { error: 'expired' },
      { status: 401, statusText: 'Unauthorized' },
    );

    const refreshReq = httpMock.expectOne(
      `${environment.baseUrl}/refresh-token`,
    );
    refreshReq.flush({
      token: 'new-access-token',
      refresh_token: 'new-refresh-token',
    });

    const retryReq = httpMock.expectOne(`${environment.baseUrl}/cartelera`);
    retryReq.flush(
      { error: 'still unauthorized' },
      { status: 401, statusText: 'Unauthorized' },
    );

    // No debe emitir una segunda llamada a /refresh-token
    httpMock.expectNone(`${environment.baseUrl}/refresh-token`);
    expect(receivedStatus).toBe(401);
  });

  it('reutiliza el token renovado por otra pestaña sin invocar /refresh-token', () => {
    authStore.syncTokens('old-token', 'old-refresh');

    let responseBody: unknown = null;
    http.get(`${environment.baseUrl}/cartelera`).subscribe((res) => {
      responseBody = res;
    });

    const firstReq = httpMock.expectOne(`${environment.baseUrl}/cartelera`);
    // Simular que otra pestaña ya rotó los tokens en localStorage
    localStorage.setItem('token', 'token-from-tab-b');
    localStorage.setItem('refreshToken', 'refresh-from-tab-b');

    firstReq.flush(
      { error: 'expired' },
      { status: 401, statusText: 'Unauthorized' },
    );

    httpMock.expectNone(`${environment.baseUrl}/refresh-token`);

    const retryReq = httpMock.expectOne(`${environment.baseUrl}/cartelera`);
    expect(retryReq.request.headers.get('Authorization')).toBe(
      'Bearer token-from-tab-b',
    );
    retryReq.flush([{ id: 'p1' }]);

    expect(responseBody).toEqual([{ id: 'p1' }]);
    expect(authStore.token()).toBe('token-from-tab-b');
  });

  it('limpia AuthStore y redirige a /auth/login cuando /refresh-token responde 401', () => {
    authStore.syncTokens('expired-token', 'expired-refresh');

    let receivedStatus = 0;
    http.get(`${environment.baseUrl}/cartelera`).subscribe({
      error: (err) => {
        receivedStatus = err.status;
      },
    });

    const firstReq = httpMock.expectOne(`${environment.baseUrl}/cartelera`);
    firstReq.flush(
      { error: 'token invalid' },
      { status: 401, statusText: 'Unauthorized' },
    );

    const refreshReq = httpMock.expectOne(
      `${environment.baseUrl}/refresh-token`,
    );
    refreshReq.flush(
      { error: 'refresh token inválido o expirado' },
      { status: 401, statusText: 'Unauthorized' },
    );

    expect(receivedStatus).toBe(401);
    expect(authService.token()).toBeNull();
    expect(authStore.isLoggedIn()).toBeFalse();
    expect(authStore.token()).toBe('');
    expect(router.navigate).toHaveBeenCalledWith(
      ['/auth/login'],
      jasmine.any(Object),
    );
    expect(notificationSpy.error).toHaveBeenCalledTimes(1);
  });

  it('limpia AuthStore y redirige a /auth/login cuando no existe refresh token', () => {
    authStore.syncTokens('expired-token', '');

    let receivedStatus = 0;
    http.get(`${environment.baseUrl}/cartelera`).subscribe({
      error: (err) => {
        receivedStatus = err.status;
      },
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/cartelera`);
    req.flush(
      { error: 'token invalid' },
      { status: 401, statusText: 'Unauthorized' },
    );

    expect(receivedStatus).toBe(401);
    expect(authService.token()).toBeNull();
    expect(authStore.isLoggedIn()).toBeFalse();
    expect(authStore.token()).toBe('');
    expect(router.navigate).toHaveBeenCalledWith(
      ['/auth/login'],
      jasmine.any(Object),
    );
  });
});
