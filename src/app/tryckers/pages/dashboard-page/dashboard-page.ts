import { Component, inject, OnInit } from '@angular/core';
import { TryckersService } from '@tryckers/services/tryckers-service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard-page',
  imports: [CardModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
  standalone: true,
})
export class DashboardPage implements OnInit {
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
