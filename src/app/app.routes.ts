import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadChildren: () => import('master-page').then(m => m.masterPageRoutes)
    },
    {
        path: 'login',
        loadChildren: () => import('login').then(m => m.loginRoutes)
    },
    {
        path: 'change-password/:token',
        loadComponent: () => import('change-password').then(m => m.ChangePasswordComponent),
        pathMatch: 'full'
    },
    {
        path: 'update-user',
        loadComponent: () => import('update-user').then(m => m.UpdateUserComponent),
        pathMatch: 'full'
    },
];
