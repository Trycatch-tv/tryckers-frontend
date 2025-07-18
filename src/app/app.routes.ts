import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/layout/app.layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Notfound } from './pages/not-found/notfound';
import { Tryckers } from './pages/tryckers/tryckers';
import { Unauthorized } from './pages/auth/unauthorized/unauthorized';
import { Login } from './pages/auth/login/login';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'tryckers', component: Tryckers }
        ]
    },
    {
        path: 'auth',
        children: [
            { path: 'unauthorized', component: Unauthorized },
            { path: 'login', component: Login }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
