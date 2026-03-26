import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { ToastComponent } from './shared/components/toast/toast.component';
import { UxMetricsService } from './shared/services/ux-metrics.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'tryckers-frontend';
  private uxMetrics = inject(UxMetricsService);
  private router = inject(Router);

  ngOnInit(): void {
    this.uxMetrics.startTiming('initial-load');

    let initialTracked = false;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEvent = event as NavigationEnd;
        this.uxMetrics.track('route_view', {
          route: navEvent.urlAfterRedirects,
        });

        if (!initialTracked) {
          initialTracked = true;
          this.uxMetrics.endTiming('initial-load', 'perceived_initial_load', {
            route: navEvent.urlAfterRedirects,
          });
        }
      });

    if (typeof window !== 'undefined') {
      (window as unknown as { uxMetrics?: unknown }).uxMetrics = {
        getSummary: () => this.uxMetrics.getSummary(),
        getEvents: () => this.uxMetrics.getEvents(),
        clear: () => this.uxMetrics.clear(),
      };
    }
  }
}
