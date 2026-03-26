import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { NotificationService } from '@shared/services/notification.service';

let lastAuthNoticeAt = 0;

export const AuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[],
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const isAuthenticated = !!authService.token();

  if (isAuthenticated) {
    return true;
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
