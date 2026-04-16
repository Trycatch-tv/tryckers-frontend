import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@auth/store/auth-store';
import { ButtonModule } from 'primeng/button';
import { DashboardPage } from '../../tryckers/pages/dashboard-page/dashboard-page';

@Component({
  selector: 'app-tryckers-page',
  imports: [CommonModule, FormsModule, RouterLink, DashboardPage, ButtonModule],
  templateUrl: './tryckers-page.component.html',
  styles: [
    `
      .landing-shell {
        min-height: calc(100vh - 200px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: var(--ui-bg-muted);
      }

      .landing-hero {
        width: min(100%, 820px);
        text-align: center;
        padding: 3rem 2.5rem;
        border: 1px solid var(--ui-border);
        border-radius: 24px;
        background: var(--ui-surface);
        box-shadow: var(--ui-shadow-md);
      }

      .landing-title {
        margin: 0 0 1rem;
        font-size: clamp(2.5rem, 5vw, 4rem);
        line-height: 1;
        font-weight: 800;
        letter-spacing: -0.04em;
        color: var(--ui-text);
      }

      .landing-copy {
        margin: 0 auto 1.75rem;
        max-width: 38rem;
        font-size: 1.1rem;
        line-height: 1.7;
        color: var(--ui-text-muted);
      }

      .landing-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .landing-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        padding: 0.85rem 1.4rem;
        border-radius: 14px;
        font-weight: 700;
        text-decoration: none;
        border: 1px solid var(--ui-border);
        transition:
          transform 0.2s ease,
          background 0.2s ease,
          border-color 0.2s ease;
      }

      .landing-button:hover {
        transform: translateY(-1px);
      }

      .landing-button-primary {
        background: var(--ui-primary);
        color: var(--ui-on-primary);
        border-color: var(--ui-primary);
      }

      .landing-button-primary:hover {
        background: var(--ui-primary-hover);
        border-color: var(--ui-primary-hover);
      }

      .landing-button-secondary {
        background: var(--ui-bg);
        color: var(--ui-primary);
      }

      .landing-button-secondary:hover {
        background: var(--ui-bg-muted);
        border-color: var(--ui-border-strong);
      }

      .landing-note {
        margin-top: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        color: var(--ui-text-muted);
      }

      .landing-link {
        color: var(--ui-primary);
        font-weight: 600;
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      .landing-link:hover {
        color: var(--ui-primary-hover);
      }

      :host-context(.dark-theme) .landing-shell {
        background: var(--ui-bg-muted);
      }

      :host-context(.dark-theme) .landing-hero {
        background: linear-gradient(
          135deg,
          color-mix(in srgb, #f59e0b 22%, var(--ui-surface) 78%) 0%,
          color-mix(in srgb, #fb923c 12%, var(--ui-surface) 88%) 48%,
          var(--ui-surface) 100%
        );
        border-color: color-mix(in srgb, #f59e0b 34%, var(--ui-border) 66%);
        box-shadow:
          0 16px 40px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(251, 146, 60, 0.12);
      }

      :host-context(.dark-theme) .landing-title {
        color: #fff7ed;
      }

      :host-context(.dark-theme) .landing-copy,
      :host-context(.dark-theme) .landing-note {
        color: #fed7aa;
      }

      :host-context(.dark-theme) .landing-link {
        color: #fdba74;
      }

      :host-context(.dark-theme) .landing-link:hover {
        color: #ffedd5;
      }

      @media (max-width: 768px) {
        .landing-shell {
          padding: 1.25rem;
        }

        .landing-hero {
          padding: 2rem 1.25rem;
          border-radius: 20px;
        }

        .landing-actions {
          flex-direction: column;
        }

        .landing-button {
          width: 100%;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .landing-button {
          transition: none;
        }

        .landing-button:hover {
          transform: none;
        }
      }
    `,
  ],
})
export default class TryckersPageComponent implements OnInit {
  readonly authStore = inject(AuthStore);

  ngOnInit() {
    // No-op
  }
}
