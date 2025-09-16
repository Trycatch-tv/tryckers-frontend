import { Component } from '@angular/core';

@Component({
  selector: 'app-tryckers-page',
  imports: [],
  templateUrl: './tryckers-page.component.html',
  styles: [
    `
      .tryckers-content {
        padding: 3rem 1rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .hero-section {
        text-align: center;
        padding: 4rem 0;
      }
    `,
  ],
})
export default class TryckersPageComponent {}
