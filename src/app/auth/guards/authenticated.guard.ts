import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AuthStore } from '@auth/store/auth-store';
import { NotificationService } from '@shared/services/notification.service';
import { firstValueFrom } from 'rxjs';

let lastAuthNoticeAt = 0;

export const AuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[],
) => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  authService.syncFromStorage();

  if (authService.token()) {
    return true;
  }

  if (authService.refreshTokenValue()) {
    try {
      const response = await firstValueFrom(authService.doRefreshToken());
      if (response?.token) {
        authStore.syncTokens(
          response.token,
          response.refresh_token || authService.refreshTokenValue() || '',
        );
        return true;
      }
    } catch (error) {
      const isDefinitive =
        error instanceof HttpErrorResponse &&
        (error.status === 400 || error.status === 401 || error.status === 403);
      if (isDefinitive) {
        authStore.logout();
      } else {
        // Error temporal de red/servidor: no destruir sesión recuperable
        return true;
      }
    }
  }

  const attemptedPath = segments.map((segment) => segment.path).join('/');
  const attemptedQuery =
    typeof window !== 'undefined' ? window.location.search : '';
  const returnUrl = attemptedPath
    ? `/${attemptedPath}${attemptedQuery}`
    : '/home';

  const now = Date.now();
  if (now - lastAuthNoticeAt > 1500) {
    notificationService.info('Debes iniciar sesión para continuar.');
    lastAuthNoticeAt = now;
  }

  router.navigate(['/auth/login'], { queryParams: { returnUrl } });
  return false;
};
