import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

export const AuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[],
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = !!authService.token();

  if (isAuthenticated) {
    return true;
  }

  const attemptedPath = segments.map((segment) => segment.path).join('/');
  const returnUrl = attemptedPath ? `/${attemptedPath}` : '/';
  router.navigate(['/auth/login'], { queryParams: { returnUrl } });
  return false;
};
