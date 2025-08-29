import { inject } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

type AuthState = { isLoggedIn: boolean; user: any; token: string };

// Función para cargar el estado inicial desde localStorage
function loadInitialState(): AuthState {
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    return {
      isLoggedIn: !!token,
      user: userData ? JSON.parse(userData) : null,
      token: token || '',
    };
  }

  return { isLoggedIn: false, user: null, token: '' };
}

export const AuthStore = signalStore(
  withState<AuthState>(loadInitialState()),
  withMethods((store) => {
    const authService = inject(AuthService);
    return {
      async login(email: string, password: string) {
        try {
          const response = await authService.login(email, password).toPromise();
          const newState = {
            isLoggedIn: response.user.Token ? true : false,
            user: response.user.UserData,
            token: response.user.Token,
          };

          // Guardar en localStorage
          localStorage.setItem('token', response.user.Token);
          localStorage.setItem(
            'userData',
            JSON.stringify(response.user.UserData),
          );
          localStorage.setItem('isLoggedIn', newState.isLoggedIn.toString());
          patchState(store, newState);
          return response;
        } catch (error) {
          throw error;
        }
      },
      setUser(user: any) {
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
        patchState(store, { isLoggedIn: false, user: null, token: '' });
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
        }
      },
    };
  }),
  withHooks({
    onInit(store) {
      // console.log('AuthStore initialized with state:', {
      //   isLoggedIn: store.isLoggedIn(),
      //   user: store.user(),
      //   token: store.token(),
      // });
    },
  }),
);
