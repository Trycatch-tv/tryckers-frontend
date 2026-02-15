import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  AuthResponse,
  RefreshTokenResponse,
  UserData,
} from '@auth/interfaces/auth-response';
import { User } from '@auth/interfaces/user';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private __user = signal<UserData | null>(null);
  private _token = signal<string | null>(null);
  private _refreshToken = signal<string | null>(null);
  private http = inject(HttpClient);

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const userDataString = localStorage.getItem('userData');

    if (token) {
      this._token.set(token);
      this._refreshToken.set(refreshToken);
      this._authStatus.set('authenticated');

      if (userDataString && userDataString !== 'undefined') {
        try {
          const userData = JSON.parse(userDataString);
          this.__user.set(userData);
        } catch (error) {
          console.error('Error parsing userData from localStorage:', error);
          localStorage.removeItem('userData');
        }
      }
    } else {
      this._authStatus.set('not-authenticated');
    }
  }

  user = computed(() => this.__user());
  token = computed(() => this._token());
  refreshTokenValue = computed(() => this._refreshToken());
  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._token()) return 'authenticated';
    return 'not-authenticated';
  });

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${baseUrl}/login`, {
      email,
      password,
    });
  }

  register(
    name: string,
    username: string,
    country: string,
    email: string,
    password: string,
  ): Observable<boolean> {
    console.log('Attempting registration with:', {
      name,
      username,
      country,
      email,
    });
    return this.http
      .post<{ user: User }>(`${baseUrl}/register`, {
        name,
        username,
        country,
        email,
        password,
      })
      .pipe(
        tap((resp) => {
          this._user.set(resp.user);
          this._authStatus.set('authenticated');
        }),
        map(() => true),
        catchError((error: HttpErrorResponse) => {
          return this.handleAuthError(error);
        }),
      );
  }

  /**
   * Refresca el access token usando el refresh token almacenado.
   */
  doRefreshToken(): Observable<RefreshTokenResponse | null> {
    const currentRefreshToken = this._refreshToken();
    if (!currentRefreshToken) {
      return of(null);
    }

    return this.http
      .post<RefreshTokenResponse>(`${baseUrl}/refresh-token`, {
        refresh_token: currentRefreshToken,
      })
      .pipe(
        tap((response) => {
          this.updateTokens(response.token, response.refresh_token);
        }),
        catchError(() => {
          this.logout();
          return of(null);
        }),
      );
  }

  /**
   * Actualiza tokens en memoria y localStorage (usado por AuthStore y el interceptor).
   */
  updateTokens(token: string, refreshToken: string): void {
    this._token.set(token);
    this._refreshToken.set(refreshToken);
    this._authStatus.set('authenticated');
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Actualiza los datos del usuario en memoria y localStorage.
   */
  setUserData(userData: UserData): void {
    this.__user.set(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  logout() {
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this.__user.set(null);
    this._token.set(null);
    this._refreshToken.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  }

  private handleAuthError(error: HttpErrorResponse): Observable<boolean> {
    console.error('Authentication error:', error);
    this.logout();
    return of(false);
  }
}
