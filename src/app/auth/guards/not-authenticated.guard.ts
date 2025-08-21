import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[],
) => {
  const authService = inject(AuthService);

  const router = inject(Router);

  // Consider the user authenticated if there's a token (simple, synchronous check)
  const isAuthenticated = !!authService.token();

  // If already authenticated, prevent access to /auth/* and redirect to home
  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }

  // Allow access to /auth/* when not authenticated
  return true;
};
