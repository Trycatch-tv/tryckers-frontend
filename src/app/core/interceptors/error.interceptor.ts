import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { getHttpErrorMessage } from '../../shared/interfaces/error';
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
          // Token expirado o no autorizado
          if (!isAuthEndpoint) {
            notificationService.error(
              'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
              'Sesión Expirada',
            );
            // Limpiar datos de sesión
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            // Redirigir al login
            router.navigate(['/auth/login']);
          }
          break;

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

        case 422:
          // Errores de validación - extraer mensaje del backend si existe
          const validationMessage =
            error.error?.message || 'Los datos enviados no son válidos.';
          notificationService.error(validationMessage, 'Error de Validación');
          break;

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
            const message =
              error.error?.message || getHttpErrorMessage(error.status);
            notificationService.error(message, 'Error');
          }
      }

      // Log del error para debugging (solo en desarrollo)
      console.error('HTTP Error:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        message: error.error?.message || error.message,
      });

      // Propagar el error para que los componentes puedan manejarlo si lo necesitan
      return throwError(() => error);
    }),
  );
};
