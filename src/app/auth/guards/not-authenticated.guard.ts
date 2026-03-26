import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

function getSafeInternalReturnUrl(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const rawReturnUrl = searchParams.get('returnUrl');

  if (!rawReturnUrl || !rawReturnUrl.startsWith('/')) {
    return null;
  }

  if (rawReturnUrl.startsWith('//') || rawReturnUrl.includes('://')) {
    return null;
  }

  if (rawReturnUrl.startsWith('/auth')) {
    return null;
  }

  return rawReturnUrl;
}

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
    const returnUrl = getSafeInternalReturnUrl();
    router.navigateByUrl(returnUrl ?? '/home');
    return false;
  }

  // Allow access to /auth/* when not authenticated
  return true;
};
