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
  tryckerService = inject(TryckersService);

  tryckers: any[] = [];

  async getTryckers() {
    try {
      this.tryckers = await this.tryckerService.getTryckers();
    } catch (error) {
      console.error('Error fetching tryckers:', error);
    }
  }

  async ngOnInit() {
    await this.getTryckers();
  }
}
