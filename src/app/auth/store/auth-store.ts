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
import { firstValueFrom } from 'rxjs';

type AuthState = {
  isLoggedIn: boolean;
  user: UserData | null;
  token: string;
  refreshToken: string;
};

// Función para cargar el estado inicial desde localStorage de forma segura
function loadInitialState(): AuthState {
  try {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const userDataString = localStorage.getItem('userData');
      let parsedUser: UserData | null = null;

      if (token && userDataString && userDataString !== 'undefined') {
        try {
          parsedUser = JSON.parse(userDataString) as UserData;
        } catch {
          localStorage.removeItem('userData');
        }
      }

      return {
        isLoggedIn: !!token,
        user: token ? parsedUser : null,
        token: token || '',
        refreshToken: token ? refreshToken || '' : '',
      };
    }
  } catch {
    // Fallback limpio si localStorage no está disponible
  }

  return { isLoggedIn: false, user: null, token: '', refreshToken: '' };
}

export const AuthStore = signalStore(
  withState<AuthState>(loadInitialState()),
  withMethods((store) => {
    const authService = inject(AuthService);
    return {
      async login(email: string, password: string) {
        const response = await firstValueFrom(
          authService.login(email, password),
        );
        if (!response?.user?.token) {
          throw new Error('No valid session token returned from server');
        }

        const newState: AuthState = {
          isLoggedIn: true,
          user: response.user.user_data,
          token: response.user.token,
          refreshToken: response.user.refresh_token || '',
        };

        // Sincronizar AuthService y localStorage
        authService.updateTokens(newState.token, newState.refreshToken);
        authService.setUserData(newState.user);

        patchState(store, newState);
        return response;
      },
      syncTokens(token: string, refreshToken: string) {
        authService.updateTokens(token, refreshToken);
        patchState(store, {
          isLoggedIn: !!token,
          token,
          refreshToken,
        });
      },
      setUser(user: UserData | null) {
        authService.setUserData(user);
        patchState(store, { user });
      },
      setIsLoggedIn(isLoggedIn: boolean) {
        patchState(store, { isLoggedIn });
      },
      setToken(token: string) {
        authService.updateTokens(token, store.refreshToken());
        patchState(store, { token, isLoggedIn: !!token });
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
    onInit() {
      // Estado inicial cargado desde localStorage
    },
  }),
);
