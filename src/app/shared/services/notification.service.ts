import { Injectable, signal } from '@angular/core';
import { Notification, NotificationType } from '../interfaces/error';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly DEFAULT_DURATION = 5000;

  // Signal para las notificaciones activas
  private _notifications = signal<Notification[]>([]);

  // Exponer las notificaciones como readonly
  notifications = this._notifications.asReadonly();

  /**
   * Muestra una notificación de éxito
   */
  success(message: string, title?: string, duration?: number): void {
    this.show('success', message, title, duration);
  }

  /**
   * Muestra una notificación de error
   */
  error(message: string, title?: string, duration?: number): void {
    this.show('error', message, title, duration ?? 7000);
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, title?: string, duration?: number): void {
    this.show('warning', message, title, duration);
  }

  /**
   * Muestra una notificación informativa
   */
  info(message: string, title?: string, duration?: number): void {
    this.show('info', message, title, duration);
  }

  /**
   * Muestra una notificación
   */
  private show(
    type: NotificationType,
    message: string,
    title?: string,
    duration: number = this.DEFAULT_DURATION,
  ): void {
    const id = this.generateId();
    const notification: Notification = {
      id,
      type,
      message,
      title,
      duration,
    };

    this._notifications.update((notifications) => [
      ...notifications,
      notification,
    ]);

    // Auto-remove después del tiempo especificado
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  /**
   * Remueve una notificación por ID
   */
  remove(id: string): void {
    this._notifications.update((notifications) =>
      notifications.filter((n) => n.id !== id),
    );
  }

  /**
   * Limpia todas las notificaciones
   */
  clear(): void {
    this._notifications.set([]);
  }

  /**
   * Genera un ID único para la notificación
   */
  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
