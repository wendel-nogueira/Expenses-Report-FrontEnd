import { Route } from '@angular/router';
import { AccountantGuard } from '../../../../guard/accountant/accountant.guard';

export const departamentsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./departaments/departaments.component').then((m) => m.DepartamentsComponent),
    pathMatch: 'full',
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./departaments/departament-edit/departament-edit.component').then(
        (m) => m.DepartamentEditComponent
      ),
    pathMatch: 'full',
    canActivate: [AccountantGuard],
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./departaments/departament-new/departament-new.component').then((m) => m.DepartamentNewComponent),
    pathMatch: 'full',
    canActivate: [AccountantGuard],
  },
];


