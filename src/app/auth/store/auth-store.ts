import { inject } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type AuthState = { isLoggedIn: boolean; user: any; token: string };

export const AuthStore = signalStore(
  withState<AuthState>({ isLoggedIn: false, user: null, token: '' }),
  withMethods((store) => {
    const authService = inject(AuthService);
    return {
      async login(email: string, password: string) {
        const response = await authService.login(email, password).toPromise();
        patchState(store, {
          isLoggedIn: response.Token ? true : false,
          user: response.user.UserData,
          token: response.user.Token,
        });
      },
    };
  }),
);
