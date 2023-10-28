import { Route } from '@angular/router';

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
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./departaments/departament-new/departament-new.component').then((m) => m.DepartamentNewComponent),
    pathMatch: 'full',
  },
];


