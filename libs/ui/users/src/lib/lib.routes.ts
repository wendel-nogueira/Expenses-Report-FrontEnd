import { Route } from '@angular/router';
import { AccountantAndManagerGuard } from '../../../../guard/accountantAndManager/accountant-and-manager.guard';

export const usersRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./users/users.component').then((m) => m.UsersComponent),
    pathMatch: 'full',
    canActivate: [AccountantAndManagerGuard],
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./users/user-edit/user-edit.component').then(
        (m) => m.UserEditComponent
      ),
    pathMatch: 'full',
    canActivate: [AccountantAndManagerGuard],
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./users/user-new/user-new.component').then((m) => m.UserNewComponent),
    pathMatch: 'full',
    canActivate: [AccountantAndManagerGuard],
  },
];
