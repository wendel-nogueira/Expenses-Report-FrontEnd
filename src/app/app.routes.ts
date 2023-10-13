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
];
