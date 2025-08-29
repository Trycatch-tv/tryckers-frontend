import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@auth/store/auth-store';
import { ButtonModule } from 'primeng/button';
import { DashboardPage } from '../dashboard-page/dashboard-page';

@Component({
  selector: 'app-tryckers-page',
  imports: [CommonModule, FormsModule, RouterLink, DashboardPage, ButtonModule],
  templateUrl: './tryckers-page.component.html',
  styles: [
    `
      .landing-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 70vh;
        text-align: center;
        padding: 2rem;
      }

      .landing-title {
        font-size: 3rem;
        font-weight: bold;
        color: #333;
        margin-bottom: 1rem;
      }

      .landing-subtitle {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 2rem;
        max-width: 600px;
      }

      .landing-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
      }

      .cta-button {
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        display: inline-block;
      }

      .cta-button:not(.secondary) {
        background: #007bff;
        color: white;
      }

      .cta-button:not(.secondary):hover {
        background: #0056b3;
      }

      .cta-button.secondary {
        background: white;
        color: #007bff;
        border: 2px solid #007bff;
      }

      .cta-button.secondary:hover {
        background: #007bff;
        color: white;
      }

      @media (max-width: 768px) {
        .landing-title {
          font-size: 2rem;
        }

        .landing-actions {
          flex-direction: column;
          align-items: center;
        }

        .cta-button {
          width: 200px;
        }
      }
    `,
  ],
})
export default class TryckersPageComponent implements OnInit {
  readonly authStore = inject(AuthStore);

  ngOnInit() {
    console.log(
      'TryckersPage initialized, isLoggedIn:',
      this.authStore.isLoggedIn(),
    );
  }
}
