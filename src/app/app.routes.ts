import { Routes } from '@angular/router';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';
import { NotAuthenticatedGuard } from './auth/guards/not-authenticated.guard';
import { MainLayoutComponent } from './shared/layouts/main-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [NotAuthenticatedGuard],
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
          import('./pages/tryckers-page/tryckers-page.component'),
      },
      {
        path: 'cartelera',
        canMatch: [AuthenticatedGuard],
        loadComponent: () =>
          import('./post/pages/cartelera-page/cartelera-page'),
      },
      {
        path: 'profile/:username',
        canMatch: [AuthenticatedGuard],
        loadComponent: () =>
          import('./tryckers/pages/profile-page/profile-page'),
      },
      {
        path: 'perfil/:username',
        redirectTo: 'profile/:username',
        pathMatch: 'full',
      },
      {
        path: 'perfil/:username/post/:id',
        redirectTo: 'profile/:username/post/:id',
        pathMatch: 'full',
      },
      {
        path: 'profile/:username/post/:id',
        canMatch: [AuthenticatedGuard],
        loadComponent: () =>
          import('./post/pages/post/post').then((m) => m.Post),
      },
      {
        path: 'settings',
        canMatch: [AuthenticatedGuard],
        loadComponent: () =>
          import('./pages/settings-page/settings-page.component').then(
            (m) => m.default,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
