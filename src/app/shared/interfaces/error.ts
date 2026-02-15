/**
 * Interface para errores del API
 */
export interface ApiError {
  error: string;
  code: number;
  fields?: Record<string, string>;
  message?: string;
}

/**
 * Tipo de notificación
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Interface para notificaciones
 */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
}

/**
 * Errores HTTP comunes
 */
export const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: 'Solicitud inválida. Por favor, verifica los datos enviados.',
  401: 'No autorizado. Por favor, inicia sesión nuevamente.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'El recurso solicitado no fue encontrado.',
  409: 'Conflicto con el estado actual del recurso.',
  422: 'Los datos enviados no son válidos.',
  500: 'Error interno del servidor. Por favor, intenta más tarde.',
  502: 'Error de conexión con el servidor.',
  503: 'Servicio no disponible. Por favor, intenta más tarde.',
  0: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
};

/**
 * Obtiene el mensaje de error según el código HTTP
 */
export function getHttpErrorMessage(statusCode: number): string {
  return HTTP_ERROR_MESSAGES[statusCode] || 'Ha ocurrido un error inesperado.';
}

/**
 * Clase de error personalizada para errores del API
 */
export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number = 500,
    public fields?: Record<string, string>,
  ) {
    super(message);
    this.name = 'AppError';
  }

  static fromHttpError(error: { status: number; error?: ApiError }): AppError {
    const message =
      error.error?.error || error.error?.message || getHttpErrorMessage(error.status);
    return new AppError(message, error.status, error.error?.fields);
  }
}

/**
 * Extrae un mensaje legible de los campos con error del backend.
 * Ejemplo: { "Content": "debe tener al menos 10 caracteres" } → "Content: debe tener..."
 */
export function formatFieldErrors(fields: Record<string, string>): string {
  return Object.entries(fields)
    .map(([field, msg]) => `• ${field}: ${msg}`)
    .join('\n');
}

/**
 * Extrae el mensaje de error principal de una respuesta HTTP del backend.
 */
export function extractBackendErrorMessage(error: ApiError | null | undefined): string | null {
  if (!error) return null;
  return error.error || error.message || null;
}

/**
 * Extrae los errores de campo de una respuesta HTTP del backend.
 */
export function extractFieldErrors(error: ApiError | null | undefined): Record<string, string> | null {
  if (!error?.fields || Object.keys(error.fields).length === 0) return null;
  return error.fields;
}
