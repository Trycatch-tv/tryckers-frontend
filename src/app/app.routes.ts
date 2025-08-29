import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    // canMatch: [NotAuthenticatedGuard], // Temporarily disabled
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./tryckers/pages/tryckers-page/tryckers-page.component'),
      },
    ],
  },
];
