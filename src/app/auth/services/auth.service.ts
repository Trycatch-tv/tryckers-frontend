import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse, UserData } from '@auth/interfaces/auth-response';
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
  private http = inject(HttpClient);

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    const token = localStorage.getItem('token');
    const userDataString = localStorage.getItem('userData');

    if (token) {
      this._token.set(token);
      this._authStatus.set('authenticated');

      // Restaurar datos del usuario si existen
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          this.__user.set(userData);
        } catch (error) {
          console.error('Error parsing userData from localStorage:', error);
          // Si hay error al parsear, limpiar localStorage
          localStorage.removeItem('userData');
        }
      }
    } else {
      this._authStatus.set('not-authenticated');
    }
  }

  user = computed(() => this.__user());
  token = computed(() => this._token());
  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    // Si tenemos un token válido, consideramos al usuario autenticado
    // incluso si no tenemos los datos del usuario cargados
    if (this._token()) return 'authenticated';

    return 'not-authenticated';
  });

  login(email: string, password: string): any {
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
  ) {
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
          console.log('Registration successful:', resp);
          this._user.set(resp.user);
          this._authStatus.set('authenticated');
        }),
        map(() => true),
        catchError((error: any) => {
          console.error('Registration failed:', error);
          return this.handleAuthError(error);
        }),
      );
  }

  logout() {
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this.__user.set(null);
    this._token.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  }

  private handleAuthError(error: any): Observable<boolean> {
    console.error('Authentication error:', error);
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this.__user.set(null);
    this._token.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    return of(false);
  }
}
