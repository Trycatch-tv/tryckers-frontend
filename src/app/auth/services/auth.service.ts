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

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/login`, {
        email,
        password,
      })
      .pipe(
        tap((resp) => this.handleAuthSuccess(resp)),
        tap((resp) => console.log('Login response:', resp)),
        map(() => true),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  register(name: string, country: string, email: string, password: string) {
    return this.http
      .post<{ user: User }>(`${baseUrl}/register`, {
        name,
        country,
        email,
        password,
      })
      .pipe(
        tap((resp) => {
          this._user.set(resp.user);
        }),
        tap((resp) => console.log('Register response:', resp)),
        map(() => true),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  logout() {
    this._user.set(null);
    this.__user.set(null);
    this._authStatus.set('not-authenticated');
    this._token.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    this._authStatus.set('checking');
    this._token.set(token);

    // Opcional: Aquí podrías hacer una llamada al backend para validar el token
    // y obtener los datos del usuario actual
    // return this.http.get<AuthResponse>(`${baseUrl}/verify-token`)
    //   .pipe(
    //     tap(resp => this.handleAuthSuccess(resp)),
    //     map(() => true),
    //     catchError(() => {
    //       this.logout();
    //       return of(false);
    //     })
    //   );

    // Por ahora, solo marca como autenticado si existe el token
    this._authStatus.set('authenticated');
    return of(true);
  }

  private handleAuthSuccess(response: AuthResponse) {
    const token = response.user.Token;
    const userData = response.user.UserData;

    this._authStatus.set('authenticated');
    this._token.set(token);
    this.__user.set(userData);

    // Guardar token y datos del usuario en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  private handleAuthError(error: any): Observable<boolean> {
    console.error('Auth error:', error);
    this.logout();
    return of(false);
  }
}
