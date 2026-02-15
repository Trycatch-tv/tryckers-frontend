import { inject } from '@angular/core';
import { UserData } from '@auth/interfaces/auth-response';
import { AuthService } from '@auth/services/auth.service';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

type AuthState = {
  isLoggedIn: boolean;
  user: UserData | null;
  token: string;
  refreshToken: string;
};

// Función para cargar el estado inicial desde localStorage
function loadInitialState(): AuthState {
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const userData = localStorage.getItem('userData');

    return {
      isLoggedIn: !!token,
      user:
        userData && userData !== 'undefined'
          ? (JSON.parse(userData) as UserData)
          : null,
      token: token || '',
      refreshToken: refreshToken || '',
    };
  }

  return { isLoggedIn: false, user: null, token: '', refreshToken: '' };
}

export const AuthStore = signalStore(
  withState<AuthState>(loadInitialState()),
  withMethods((store) => {
    const authService = inject(AuthService);
    return {
      async login(email: string, password: string) {
        try {
          const response = await authService.login(email, password).toPromise();
          if (!response) {
            throw new Error('No response from server');
          }

          const newState: AuthState = {
            isLoggedIn: !!response.user.token,
            user: response.user.user_data,
            token: response.user.token,
            refreshToken: response.user.refresh_token || '',
          };

          // Sincronizar AuthService (para que el interceptor tenga el token)
          authService.updateTokens(
            response.user.token,
            response.user.refresh_token || '',
          );
          authService.setUserData(response.user.user_data);

          // Guardar en localStorage
          localStorage.setItem('isLoggedIn', newState.isLoggedIn.toString());

          patchState(store, newState);
          return response;
        } catch (error) {
          throw error;
        }
      },
      setUser(user: UserData | null) {
        patchState(store, { user });
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('userData', JSON.stringify(user));
        }
      },
      setIsLoggedIn(isLoggedIn: boolean) {
        patchState(store, { isLoggedIn });
      },
      setToken(token: string) {
        patchState(store, { token });
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('token', token);
        }
      },
      logout() {
        authService.logout();
        patchState(store, {
          isLoggedIn: false,
          user: null,
          token: '',
          refreshToken: '',
        });
      },
    };
  }),
  withHooks({
    onInit(store) {
      // Estado inicial cargado desde localStorage
    },
  }),
);
