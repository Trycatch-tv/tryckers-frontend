
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse, UserData } from '@auth/interfaces/auth-response';
import { User} from '@auth/interfaces/user';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('not-authenticated');
  private _user = signal<User | null>(null);
  private __user = signal<UserData | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private http = inject(HttpClient);


  user = computed(() => this.__user());
  token = computed(() => this._token());
  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    return this.__user() ? 'authenticated' : 'not-authenticated';
  });


  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/login`, {
      email,
      password,
    }).pipe(
      tap(resp => this.handleAuthSuccess(resp)),
      tap(resp => console.log('Login response:', resp)),
      map(() => true),
      catchError((error: any) => this.handleAuthError(error))
    );
  }


  register(name: string, country: string, email: string, password: string) {
    return this.http.post<{ user: User }>(`${baseUrl}/register`, {
      name,
      country,
      email,
      password
    }).pipe(
      tap(resp => {
        this._user.set(resp.user);
      }),
      tap(resp => console.log('Register response:', resp)),
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
  }


  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    return of(true);
  }


  private handleAuthSuccess(response: AuthResponse) {
    const token = response.user.Token;
    const userData = response.user.UserData;

    this._authStatus.set('authenticated');
    this._token.set(token);
    this.__user.set(userData);
    localStorage.setItem('token', token);
  }


  private handleAuthError(error: any): Observable<boolean> {
    console.error('Auth error:', error);
    this.logout();
    return of(false);
  }
}

