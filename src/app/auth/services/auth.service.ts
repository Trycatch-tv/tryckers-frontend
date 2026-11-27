import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  AuthResponse,
  RefreshTokenResponse,
  UserData,
} from '@auth/interfaces/auth-response';
import { User } from '@auth/interfaces/user';
import { Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;
const AUTH_STORAGE_KEYS = new Set([
  'token',
  'refreshToken',
  'userData',
  'isLoggedIn',
]);

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private __user = signal<UserData | null>(null);
  private _token = signal<string | null>(null);
  private _refreshToken = signal<string | null>(null);
  private _storageSync = new Subject<void>();
  private http = inject(HttpClient);

  readonly storageSynced$ = this._storageSync.asObservable();

  constructor() {
    this.syncFromStorage();
    this.bindStorageListener();
  }

  private bindStorageListener(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === null || AUTH_STORAGE_KEYS.has(event.key)) {
        this.syncFromStorage();
        this._storageSync.next();
      }
    });
  }

  /**
   * Reconcilia el estado en memoria con localStorage (inicio, recarga o cambios desde otra pestaña).
   */
  syncFromStorage(): void {
    const token = this.safeGetItem('token');
    const refreshToken = this.safeGetItem('refreshToken');
    const userDataString = this.safeGetItem('userData');

    if (token || refreshToken) {
      this._token.set(token || null);
      this._refreshToken.set(refreshToken || null);
      this._authStatus.set('authenticated');

      if (userDataString && userDataString !== 'undefined') {
        try {
          const userData = JSON.parse(userDataString) as UserData;
          this.__user.set(userData);
        } catch (error) {
          console.error('Error parsing userData from localStorage:', error);
          this.__user.set(null);
          this.safeRemoveItem('userData');
        }
      } else {
        this.__user.set(null);
      }
    } else {
      this._token.set(null);
      this._refreshToken.set(null);
      this.__user.set(null);
      this._authStatus.set('not-authenticated');
      this.safeRemoveItem('isLoggedIn');
    }
  }

  user = computed(() => this.__user());
  token = computed(() => this._token());
  refreshTokenValue = computed(() => this._refreshToken());
  hasRecoverableSession = computed(
    () => !!(this._token() || this._refreshToken()),
  );
  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._token() || this._refreshToken()) return 'authenticated';
    return 'not-authenticated';
  });

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${baseUrl}/login`, {
      email,
      password,
    });
  }

  /**
   * Registra un nuevo usuario en el backend.
   * No establece estado de autenticación ni tokens en memoria; la sesión se inicia
   * mediante el flujo de login existente (AuthStore.login).
   */
  register(
    name: string,
    username: string,
    country: string,
    email: string,
    password: string,
  ): Observable<User> {
    return this.http.post<User>(`${baseUrl}/register`, {
      name,
      username,
      country,
      email,
      password,
    });
  }

  /**
   * Refresca el access token usando el refresh token almacenado.
   * Propaga el error HTTP al llamador para distinguir fallos definitivos (401/400)
   * de errores transitorios de red o servidor (0, 5xx) sin destruir prematuramente la sesión.
   */
  doRefreshToken(): Observable<RefreshTokenResponse> {
    const currentRefreshToken =
      this._refreshToken() || this.safeGetItem('refreshToken');
    if (!currentRefreshToken) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized',
            error: { error: 'refresh token missing' },
          }),
      );
    }

    return this.http
      .post<RefreshTokenResponse>(`${baseUrl}/refresh-token`, {
        refresh_token: currentRefreshToken,
      })
      .pipe(
        tap((response) => {
          if (response?.token) {
            this.updateTokens(
              response.token,
              response.refresh_token || currentRefreshToken,
            );
          }
        }),
      );
  }

  /**
   * Actualiza tokens en memoria y localStorage (usado por AuthStore y el interceptor).
   */
  updateTokens(token: string, refreshToken: string): void {
    this._token.set(token);
    this._refreshToken.set(refreshToken);
    this._authStatus.set(token ? 'authenticated' : 'not-authenticated');
    if (token) {
      this.safeSetItem('token', token);
      this.safeSetItem('refreshToken', refreshToken);
      this.safeSetItem('isLoggedIn', 'true');
    } else {
      this.safeRemoveItem('token');
      this.safeRemoveItem('refreshToken');
      this.safeRemoveItem('isLoggedIn');
    }
  }

  /**
   * Actualiza los datos del usuario en memoria y localStorage.
   */
  setUserData(userData: UserData | null): void {
    this.__user.set(userData);
    if (userData) {
      this.safeSetItem('userData', JSON.stringify(userData));
    } else {
      this.safeRemoveItem('userData');
    }
  }

  logout(): void {
    this._authStatus.set('not-authenticated');
    this.__user.set(null);
    this._token.set(null);
    this._refreshToken.set(null);
    this.safeRemoveItem('token');
    this.safeRemoveItem('refreshToken');
    this.safeRemoveItem('userData');
    this.safeRemoveItem('isLoggedIn');
  }

  private safeGetItem(key: string): string | null {
    try {
      if (typeof localStorage === 'undefined') {
        return null;
      }
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private safeSetItem(key: string, value: string): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch {
      // Ignorar errores de cuota o almacenamiento restringido
    }
  }

  private safeRemoveItem(key: string): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch {
      // Ignorar errores de almacenamiento restringido
    }
  }
}
