import { Route } from '@angular/router';

export const usersRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./users/users.component').then((m) => m.UsersComponent),
    pathMatch: 'full',
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./users/user-edit/user-edit.component').then(
        (m) => m.UserEditComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./users/user-new/user-new.component').then((m) => m.UserNewComponent),
    pathMatch: 'full',
  },
];
