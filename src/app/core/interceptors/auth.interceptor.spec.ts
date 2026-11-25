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
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let authStore: InstanceType<typeof AuthStore>;
  let router: Router;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    localStorage.clear();
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
    firstReq.flush({ error: 'token invalid' }, { status: 401, statusText: 'Unauthorized' });

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
    expect(authStore.token()).toBe('new-access-token');
    expect(authStore.isLoggedIn()).toBeTrue();
  });

  it('limpia AuthStore y redirige a /auth/login cuando no puede renovar la sesión', () => {
    authStore.syncTokens('expired-token', '');

    let receivedStatus = 0;
    http.get(`${environment.baseUrl}/cartelera`).subscribe({
      error: (err) => {
        receivedStatus = err.status;
      },
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/cartelera`);
    req.flush({ error: 'token invalid' }, { status: 401, statusText: 'Unauthorized' });

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
