import { Route } from '@angular/router';

export const projectsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./projects/projects.component').then((m) => m.ProjectsComponent),
    pathMatch: 'full',
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./projects/project-edit/project-edit.component').then(
        (m) => m.ProjectEditComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./projects/project-new/project-new.component').then((m) => m.ProjectNewComponent),
    pathMatch: 'full',
  },
];
