import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthResponse } from '../interfaces/auth-response';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.baseUrl;

  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user successfully', () => {
    const mockResponse: AuthResponse = {
      user: {
        Token: 'test-token',
        UserData: { id: '1', email: 'test@example.com' } as any,
      },
    } as any;

    service.login('test@example.com', 'password').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password' });
    req.flush(mockResponse);
  });

  it('should register user successfully', () => {
    const mockResponse = { user: { id: '1', email: 'test@example.com' } };

    service.register('Test User', 'testuser', 'US', 'test@example.com', 'password').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should have checking status initially when no token', () => {
    expect(service.authStatus()).toBe('not-authenticated');
  });

  it('should return user as null initially', () => {
    expect(service.user()).toBeNull();
  });

  it('should return token as null initially', () => {
    expect(service.token()).toBeNull();
  });
});
