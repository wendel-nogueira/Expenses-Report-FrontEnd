import { Route } from '@angular/router';

export const masterPageRoutes: Route[] = [
  { 
    path: '', 
    loadComponent: () => import('./master-page/master-page.component').then(m => m.MasterPageComponent),
    children: [
      {
        path: 'users',
        loadChildren: () => import('users').then(m => m.usersRoutes),
      }
    ],
  },
];
