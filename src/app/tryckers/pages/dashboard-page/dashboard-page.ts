import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Trycker } from '@tryckers/interfaces';
import { TryckersService } from '@tryckers/services/tryckers-service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard-page',
  imports: [CardModule, RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
  standalone: true,
})
export class DashboardPage implements OnInit {
  tryckers: Trycker[] = [];
  loading = true;

  private tryckersService = inject(TryckersService);
  private router = inject(Router);

  async ngOnInit(): Promise<void> {
    try {
      this.loading = true;
      this.tryckers = await this.tryckersService.getTryckers();
    } catch (error) {
      console.error('Error loading tryckers:', error);
      // Fallback data en caso de error
      this.tryckers = [];
    } finally {
      this.loading = false;
    }
  }

  viewProfile(trycker: Trycker): void {
    // Usar username si existe, si no usar el name como fallback
    const username =
      trycker.name?.toLowerCase().replace(/\\s+/g, '') || trycker.id;
    this.router.navigate(['/profile', username]);
  }
}
