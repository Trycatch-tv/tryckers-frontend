import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { AuthStore } from '@auth/store/auth-store';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    providePrimeNG({
      ripple: true,
      inputStyle: 'outlined',
    }),
    AuthStore, // Proporcionar el store globalmente
  ],
};
