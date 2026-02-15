import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import {
  ApiError,
  extractBackendErrorMessage,
  extractFieldErrors,
  formatFieldErrors,
  getHttpErrorMessage,
} from '../../shared/interfaces/error';
import { NotificationService } from '../../shared/services/notification.service';

/**
 * Interceptor funcional para manejo centralizado de errores HTTP
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // No mostrar notificación si es un error de autenticación en login/register
      const isAuthEndpoint =
        req.url.includes('/login') || req.url.includes('/register');

      // Manejar errores específicos
      switch (error.status) {
        case 401:
          // El 401 lo maneja el authInterceptor (refresh token).
          // Aquí solo mostramos error si es en login/register.
          if (isAuthEndpoint) {
            notificationService.error(
              'Credenciales inválidas. Verifica tu email y contraseña.',
              'Error de Autenticación',
            );
          }
          break;

        case 400: {
          const apiErr400 = error.error as ApiError | undefined;
          const fieldErrors400 = extractFieldErrors(apiErr400);

          if (fieldErrors400) {
            notificationService.error(
              formatFieldErrors(fieldErrors400),
              'Error de Validación',
            );
          } else {
            const mainMsg400 =
              extractBackendErrorMessage(apiErr400) || 'Solicitud inválida. Verifica los datos enviados.';
            notificationService.error(mainMsg400, 'Error de Solicitud');
          }
          break;
        }

        case 403:
          notificationService.error(
            'No tienes permisos para realizar esta acción.',
            'Acceso Denegado',
          );
          break;

        case 404:
          // Solo mostrar si no es un endpoint de datos que puede no existir
          if (!req.url.includes('/posts/') && !req.url.includes('/users/')) {
            notificationService.error(
              'El recurso solicitado no fue encontrado.',
              'No Encontrado',
            );
          }
          break;

        case 422: {
          const apiErr422 = error.error as ApiError | undefined;
          const fieldErrors422 = extractFieldErrors(apiErr422);

          if (fieldErrors422) {
            notificationService.error(
              formatFieldErrors(fieldErrors422),
              'Error de Validación',
            );
          } else {
            const mainMsg422 =
              extractBackendErrorMessage(apiErr422) || 'Los datos enviados no son válidos.';
            notificationService.error(mainMsg422, 'Error de Validación');
          }
          break;
        }

        case 500:
        case 502:
        case 503:
          notificationService.error(
            'Ha ocurrido un error en el servidor. Por favor, intenta más tarde.',
            'Error del Servidor',
          );
          break;

        case 0:
          // Error de red (sin conexión)
          notificationService.error(
            'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
            'Error de Conexión',
          );
          break;

        default:
          // Para otros errores, solo mostrar si no es una operación silenciosa
          if (error.status >= 400) {
            const apiErrDefault = error.error as ApiError | undefined;
            const fieldErrorsDefault = extractFieldErrors(apiErrDefault);

            if (fieldErrorsDefault) {
              notificationService.error(
                formatFieldErrors(fieldErrorsDefault),
                'Error',
              );
            } else {
              const mainMsgDefault =
                extractBackendErrorMessage(apiErrDefault) || getHttpErrorMessage(error.status);
              notificationService.error(mainMsgDefault, 'Error');
            }
          }
      }

      // Log del error para debugging (solo en desarrollo)
      console.error('HTTP Error:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        error: error.error,
      });

      // Propagar el error para que los componentes puedan manejarlo si lo necesitan
      return throwError(() => error);
    }),
  );
};
