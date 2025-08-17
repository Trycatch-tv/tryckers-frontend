import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TryckersService } from '../../services/tryckers-service';

@Component({
  selector: 'app-tryckers-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './tryckers-page.component.html',
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background-color: #ffffff;
      }

      :host(.app-dark) {
        background-color: #000000;
      }

      .pattern-bg {
        background-image: repeating-linear-gradient(
          45deg,
          transparent 0px,
          transparent 4px,
          currentColor 4px,
          currentColor 8px
        );
      }

      .card-hover:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .app-dark .card-hover:hover {
        box-shadow: 0 8px 25px rgba(255, 255, 255, 0.15);
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .fade-in {
        animation: fadeIn 0.5s ease-out;
      }
    `,
  ],
})
export default class TryckersPageComponent implements OnInit {
  tryckers: any[] = [];
  loading = true;

  private tryckersService = inject(TryckersService);

  async ngOnInit(): Promise<void> {
    try {
      this.loading = true;
      this.tryckers = await this.tryckersService.getTryckers();
    } catch (error) {
      console.error('Error loading tryckers:', error);
      // Fallback data en caso de error
      this.tryckers = [
        {
          id: 1,
          name: 'ZIRUS16',
          email: 'zirus16@example.com',
          country: 'Colombia',
        },
        {
          id: 2,
          name: 'JULIAN',
          email: 'julian@example.com',
          country: 'Chile',
        },
        {
          id: 3,
          name: 'SANTIAGO',
          email: 'santiago@example.com',
          country: 'Colombia',
        },
      ];
    } finally {
      this.loading = false;
    }
  }
}
