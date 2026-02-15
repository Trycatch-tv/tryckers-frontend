import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (
        notification of notificationService.notifications();
        track notification.id
      ) {
        <div
          class="toast"
          [class]="'toast-' + notification.type"
          (click)="notificationService.remove(notification.id)"
        >
          <div class="toast-icon">
            @switch (notification.type) {
              @case ('success') {
                ✓
              }
              @case ('error') {
                ✕
              }
              @case ('warning') {
                ⚠
              }
              @case ('info') {
                ℹ
              }
            }
          </div>
          <div class="toast-content">
            @if (notification.title) {
              <div class="toast-title">{{ notification.title }}</div>
            }
            <div class="toast-message">{{ notification.message }}</div>
          </div>
          <button
            class="toast-close"
            (click)="notificationService.remove(notification.id)"
          >
            ×
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
      }

      .toast {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        animation: slideIn 0.3s ease-out;
        background: white;
        border-left: 4px solid;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .toast-success {
        border-left-color: #10b981;
        background: #ecfdf5;
      }

      .toast-error {
        border-left-color: #ef4444;
        background: #fef2f2;
      }

      .toast-warning {
        border-left-color: #f59e0b;
        background: #fffbeb;
      }

      .toast-info {
        border-left-color: #3b82f6;
        background: #eff6ff;
      }

      .toast-icon {
        font-size: 18px;
        font-weight: bold;
        min-width: 24px;
        text-align: center;
      }

      .toast-success .toast-icon {
        color: #10b981;
      }
      .toast-error .toast-icon {
        color: #ef4444;
      }
      .toast-warning .toast-icon {
        color: #f59e0b;
      }
      .toast-info .toast-icon {
        color: #3b82f6;
      }

      .toast-content {
        flex: 1;
      }

      .toast-title {
        font-weight: 600;
        margin-bottom: 4px;
        color: #111827;
      }

      .toast-message {
        color: #4b5563;
        font-size: 14px;
        line-height: 1.4;
      }

      .toast-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #9ca3af;
        padding: 0;
        line-height: 1;
      }

      .toast-close:hover {
        color: #4b5563;
      }
    `,
  ],
})
export class ToastComponent {
  notificationService = inject(NotificationService);
}
