import { Route } from '@angular/router';

export const expenseRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./expense/expense.component').then((m) => m.ExpenseComponent),
    pathMatch: 'full',
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./expense/expense-new/expense-new.component').then(
        (m) => m.ExpenseNewComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./expense/expense-edit/expense-edit.component').then(
        (m) => m.ExpenseEditComponent
      ),
    pathMatch: 'full',
  },
];
