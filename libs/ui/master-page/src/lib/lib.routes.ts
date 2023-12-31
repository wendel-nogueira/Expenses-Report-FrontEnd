/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';
import { AuthGuard } from 'libs/guard/auth/auth.guard';
import { UserExistsGuard } from 'libs/guard/userExists/user-exists.guard';

export const masterPageRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./master-page/master-page.component').then(
        (m) => m.MasterPageComponent
      ),
    canActivate: [AuthGuard, UserExistsGuard],
    children: [
      {
        path: 'users',
        loadChildren: () => import('users').then((m) => m.usersRoutes),
      },
      {
        path: 'departaments',
        loadChildren: () =>
          import('departaments').then((m) => m.departamentsRoutes),
      },
      {
        path: 'projects',
        loadChildren: () => import('projects').then((m) => m.projectsRoutes),
      },
      {
        path: 'expense-accounts',
        loadChildren: () =>
          import('@expense-account').then((m) => m.expenseAccountRoutes),
      },
      {
        path: 'expense-reports',
        loadChildren: () =>
          import('@expense-report').then((m) => m.expenseReportRoutes),
      },
      {
        path: 'profile',
        loadChildren: () => import('profile').then((m) => m.profileRoutes),
      },
    ],
  },
];
