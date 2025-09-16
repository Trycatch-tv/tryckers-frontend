import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { Icon } from '../../interfaces/icon';

@Component({
  selector: 'app-footer',
  imports: [ButtonModule, DividerModule, CardModule, TooltipModule],
  templateUrl: './footer.component.html',
  styles: [
    `
      .footer-container {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        padding: 2rem 1rem;
      }

      .social-button {
        margin: 0.25rem;
      }

      .brand-text {
        color: #3b82f6;
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 1rem;
      }

      .social-container {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .footer-content {
        text-align: center;
        color: #e2e8f0;
      }
    `,
  ],
})
export class FooterComponent {
  socialNetworks: Icon[] = [
    {
      label: 'Facebook',
      icon: 'pi pi-facebook',
      route: 'https://facebook.com',
    },
    {
      label: 'Instagram',
      icon: 'pi pi-instagram',
      route: 'https://instagram.com',
    },
    {
      label: 'Github',
      icon: 'pi pi-github',
      route: 'https://github.com',
    },
    {
      label: 'Twitter',
      icon: 'pi pi-twitter',
      route: 'https://twitter.com',
    },
  ];

  openSocialLink(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
