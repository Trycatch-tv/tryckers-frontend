import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menubar } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  imports: [Menubar, ButtonModule, RouterModule],
  templateUrl: './header.component.html',
  styles: [
    `
      .brand-container {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .brand-icon {
        font-size: 1.5rem;
        color: #3b82f6;
        margin-right: 0.5rem;
      }

      .brand-text {
        font-size: 1.5rem;
        font-weight: bold;
        color: #3b82f6;
        transition: color 0.3s ease;
      }

      .brand-text:hover {
        color: #2563eb;
      }

      .nav-buttons {
        display: flex;
        gap: 0.5rem;
      }
    `,
  ],
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(private router: Router) {}

  ngOnInit() {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
