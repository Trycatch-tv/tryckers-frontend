import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { getSafeReturnUrl } from '@auth/utils/return-url';

function getSafeInternalReturnUrl(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const searchParams = new URLSearchParams(window.location.search);
  return getSafeReturnUrl(searchParams.get('returnUrl'));
}

export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[],
) => {
  const authService = inject(AuthService);

  const router = inject(Router);

  authService.syncFromStorage();

  // Consider the user authenticated if there's an active or recoverable session
  const isAuthenticated = authService.hasRecoverableSession();

  // If already authenticated, prevent access to /auth/* and redirect to home
  if (isAuthenticated) {
    const returnUrl = getSafeInternalReturnUrl();
    router.navigateByUrl(returnUrl ?? '/home');
    return false;
  }

  // Allow access to /auth/* when not authenticated
  return true;
};
