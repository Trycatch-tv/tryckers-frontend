import {
  HttpContextToken,
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
  finalize,
  switchMap,
  take,
  throwError,
} from 'rxjs';

type RefreshSignal =
  | { status: 'pending' }
  | { status: 'success'; token: string }
  | { status: 'failed'; error: HttpErrorResponse }
  | { status: 'transient-error'; error: HttpErrorResponse };

export const IS_AUTH_RETRY = new HttpContextToken<boolean>(() => false);

let isRefreshing = false;
let lastExpiredNoticeAt = 0;
const refreshTokenSubject = new BehaviorSubject<RefreshSignal>({
  status: 'pending',
});

/**
 * Utilidad solo para pruebas unitarias: reinicia el estado compartido del interceptor.
 */
export function resetAuthInterceptorStateForTests(): void {
  isRefreshing = false;
  lastExpiredNoticeAt = 0;
  refreshTokenSubject.next({ status: 'pending' });
}

/**
 * Interceptor que:
 * 1. Inyecta el Bearer token en cada request autenticada.
 * 2. Al recibir un 401, coordina una única renovación compartida, sincroniza AuthStore/AuthService y reintenta la request.
 * 3. Distingue errores definitivos de refresh (400/401/403) de errores transitorios (0/5xx/429) y de errores de la petición reintentada.
 * 4. Evita ciclos infinitos de reintento mediante IS_AUTH_RETRY.
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
      const alreadyRetried = authReq.context.get(IS_AUTH_RETRY);
      if (error.status === 401 && !isAuthEndpoint && !alreadyRetried) {
        return handle401(
          authReq,
          token,
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

function markAsRetry(req: HttpRequest<unknown>): HttpRequest<unknown> {
  return req.clone({
    context: req.context.set(IS_AUTH_RETRY, true),
  });
}

function isDefinitiveRefreshFailure(error: unknown): boolean {
  if (!(error instanceof HttpErrorResponse)) {
    return false;
  }
  return error.status === 400 || error.status === 401 || error.status === 403;
}

function handle401(
  req: HttpRequest<unknown>,
  failedToken: string | null,
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
          return next(addToken(markAsRetry(req), signal.token));
        }
        return throwError(() => signal.error);
      }),
    );
  }

  // Verificar si otra pestaña ya rotó el token en localStorage antes de pedir un nuevo refresh
  authService.syncFromStorage();
  const latestToken = authService.token();
  if (latestToken && latestToken !== failedToken) {
    authStore.syncTokens(latestToken, authService.refreshTokenValue() || '');
    return next(addToken(markAsRetry(req), latestToken));
  }

  const currentRefreshToken = authService.refreshTokenValue();
  if (!currentRefreshToken) {
    const missingErr = new HttpErrorResponse({ status: 401 });
    return forceLogout(authStore, router, notificationService, missingErr);
  }

  isRefreshing = true;
  refreshTokenSubject.next({ status: 'pending' });

  return authService.doRefreshToken().pipe(
    catchError((refreshError: HttpErrorResponse) => {
      isRefreshing = false;

      if (isDefinitiveRefreshFailure(refreshError)) {
        refreshTokenSubject.next({ status: 'failed', error: refreshError });
        return forceLogout(authStore, router, notificationService, refreshError);
      }

      // Error temporal de red (0) o servidor (500/502/503/504/429): conservar la sesión
      refreshTokenSubject.next({
        status: 'transient-error',
        error: refreshError,
      });
      return throwError(() => refreshError);
    }),
    finalize(() => {
      if (isRefreshing) {
        isRefreshing = false;
        if (refreshTokenSubject.value.status === 'pending') {
          refreshTokenSubject.next({
            status: 'transient-error',
            error: new HttpErrorResponse({ status: 0 }),
          });
        }
      }
    }),
    switchMap((response) => {
      isRefreshing = false;

      if (!response?.token) {
        const invalidErr = new HttpErrorResponse({ status: 401 });
        refreshTokenSubject.next({ status: 'failed', error: invalidErr });
        return forceLogout(authStore, router, notificationService, invalidErr);
      }

      const nextRefreshToken =
        response.refresh_token || authService.refreshTokenValue() || '';
      // Sincronizar AuthStore junto con AuthService y localStorage
      authStore.syncTokens(response.token, nextRefreshToken);

      // Notificar a las requests encoladas el nuevo token
      refreshTokenSubject.next({ status: 'success', token: response.token });
      // Reintentar la request original fuera del catchError del refresh
      return next(addToken(markAsRetry(req), response.token));
    }),
  );
}

function forceLogout(
  authStore: InstanceType<typeof AuthStore>,
  router: Router,
  notificationService: NotificationService,
  error: HttpErrorResponse,
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
  return throwError(() => error);
}
