import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { NotificationService } from '@shared/services/notification.service';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

/**
 * Interceptor que:
 * 1. Inyecta el Bearer token en cada request autenticada.
 * 2. Al recibir un 401, intenta refrescar el token y reintentar la request.
 * 3. Si el refresh falla, cierra sesión y redirige al login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const isAuthEndpoint =
    req.url.includes('/login') ||
    req.url.includes('/register') ||
    req.url.includes('/refresh-token');

  // Agregar token a las requests que no sean de autenticación
  let authReq = req;
  const token = authService.token();
  if (token && !isAuthEndpoint) {
    authReq = addToken(req, token);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthEndpoint) {
        return handle401(authReq, next, authService, router, notificationService);
      }
      return throwError(() => error);
    }),
  );
};

function addToken(
  req: HttpRequest<unknown>,
  token: string,
): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router,
  notificationService: NotificationService,
) {
  // Si ya hay un refresh en curso, encolamos la request
  if (isRefreshing) {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next(addToken(req, token!))),
    );
  }

  isRefreshing = true;
  refreshTokenSubject.next(null);

  const currentRefreshToken = authService.refreshTokenValue();

  if (!currentRefreshToken) {
    isRefreshing = false;
    return forceLogout(authService, router, notificationService);
  }

  return authService.doRefreshToken().pipe(
    switchMap((response) => {
      isRefreshing = false;

      if (!response) {
        return forceLogout(authService, router, notificationService);
      }

      // Notificar a las requests encoladas el nuevo token
      refreshTokenSubject.next(response.token);
      // Reintentar la request original con el nuevo token
      return next(addToken(req, response.token));
    }),
    catchError(() => {
      isRefreshing = false;
      return forceLogout(authService, router, notificationService);
    }),
  );
}

function forceLogout(
  authService: AuthService,
  router: Router,
  notificationService: NotificationService,
) {
  authService.logout();
  notificationService.error(
    'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    'Sesión Expirada',
  );
  router.navigate(['/auth/login']);
  return throwError(() => new HttpErrorResponse({ status: 401 }));
}
