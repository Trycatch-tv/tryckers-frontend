import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AuthStore } from '@auth/store/auth-store';
import { getSafeReturnUrl } from '@auth/utils/return-url';
import { NotificationService } from '@shared/services/notification.service';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';

type RefreshSignal =
  | { status: 'pending' }
  | { status: 'success'; token: string }
  | { status: 'failed' };

let isRefreshing = false;
let lastExpiredNoticeAt = 0;
const refreshTokenSubject = new BehaviorSubject<RefreshSignal>({
  status: 'pending',
});

/**
 * Interceptor que:
 * 1. Inyecta el Bearer token en cada request autenticada.
 * 2. Al recibir un 401, intenta refrescar el token, sincroniza AuthStore/AuthService y reintenta la request.
 * 3. Si el refresh falla, limpia la sesión sincronizadamente y redirige al login preservando returnUrl.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);
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
        return handle401(
          authReq,
          next,
          authService,
          authStore,
          router,
          notificationService,
        );
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
  authStore: InstanceType<typeof AuthStore>,
  router: Router,
  notificationService: NotificationService,
) {
  // Si ya hay un refresh en curso, encolamos la request hasta recibir éxito o fallo
  if (isRefreshing) {
    return refreshTokenSubject.pipe(
      filter((signal) => signal.status !== 'pending'),
      take(1),
      switchMap((signal) => {
        if (signal.status === 'success') {
          return next(addToken(req, signal.token));
        }
        return throwError(() => new HttpErrorResponse({ status: 401 }));
      }),
    );
  }

  isRefreshing = true;
  refreshTokenSubject.next({ status: 'pending' });

  const currentRefreshToken = authService.refreshTokenValue();

  if (!currentRefreshToken) {
    isRefreshing = false;
    refreshTokenSubject.next({ status: 'failed' });
    return forceLogout(authStore, router, notificationService);
  }

  return authService.doRefreshToken().pipe(
    switchMap((response) => {
      isRefreshing = false;

      if (!response?.token) {
        refreshTokenSubject.next({ status: 'failed' });
        return forceLogout(authStore, router, notificationService);
      }

      // Sincronizar AuthStore junto con AuthService y localStorage
      authStore.syncTokens(response.token, response.refresh_token);

      // Notificar a las requests encoladas el nuevo token
      refreshTokenSubject.next({ status: 'success', token: response.token });
      // Reintentar la request original con el nuevo token
      return next(addToken(req, response.token));
    }),
    catchError(() => {
      isRefreshing = false;
      refreshTokenSubject.next({ status: 'failed' });
      return forceLogout(authStore, router, notificationService);
    }),
  );
}

function forceLogout(
  authStore: InstanceType<typeof AuthStore>,
  router: Router,
  notificationService: NotificationService,
) {
  authStore.logout();

  const now = Date.now();
  if (now - lastExpiredNoticeAt > 1500) {
    notificationService.error(
      'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      'Sesión Expirada',
    );
    lastExpiredNoticeAt = now;
  }

  const returnUrl = getSafeReturnUrl(router.url);
  router.navigate(['/auth/login'], {
    queryParams: returnUrl ? { returnUrl } : undefined,
  });
  return throwError(() => new HttpErrorResponse({ status: 401 }));
}
