/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';
import { AuthGuard } from 'libs/guard/auth/auth.guard';

export const masterPageRoutes: Route[] = [
  { 
    path: '', 
    loadComponent: () => import('./master-page/master-page.component').then(m => m.MasterPageComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        loadChildren: () => import('users').then(m => m.usersRoutes),
      }
    ],
  },
];
