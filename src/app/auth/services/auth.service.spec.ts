import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('register() no establece estado falso de autenticación ni tokens', () => {
    let receivedUser: unknown = null;

    service
      .register('Juan Perez', 'juanp', 'colombia', 'juan@test.com', 'secret123')
      .subscribe((user) => {
        receivedUser = user;
      });

    const req = httpMock.expectOne(`${environment.baseUrl}/register`);
    expect(req.request.method).toBe('POST');
    req.flush({
      id: 'user-1',
      name: 'Juan Perez',
      username: 'juanp',
      country: 'colombia',
      email: 'juan@test.com',
      role: 'member',
    });

    expect(receivedUser).toBeTruthy();
    expect(service.token()).toBeNull();
    expect(service.refreshTokenValue()).toBeNull();
    expect(service.authStatus()).toBe('not-authenticated');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
  });

  it('updateTokens() y logout() mantienen sincronizados los signals y localStorage', () => {
    service.updateTokens('access-123', 'refresh-456');

    expect(service.token()).toBe('access-123');
    expect(service.refreshTokenValue()).toBe('refresh-456');
    expect(service.authStatus()).toBe('authenticated');
    expect(localStorage.getItem('token')).toBe('access-123');
    expect(localStorage.getItem('refreshToken')).toBe('refresh-456');
    expect(localStorage.getItem('isLoggedIn')).toBe('true');

    service.logout();

    expect(service.token()).toBeNull();
    expect(service.refreshTokenValue()).toBeNull();
    expect(service.authStatus()).toBe('not-authenticated');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(localStorage.getItem('userData')).toBeNull();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
  });
});
