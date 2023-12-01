import { Route } from '@angular/router';

export const expenseReportRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./expense-report/expense-report.component').then(
        (m) => m.ExpenseReportComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'new',
    loadComponent: () =>
      import(
        './expense-report/expense-report-new/expense-report-new.component'
      ).then((m) => m.ExpenseReportNewComponent),
    pathMatch: 'full',
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import(
        './expense-report/expense-report-edit/expense-report-edit.component'
      ).then((m) => m.ExpenseReportEditComponent),
    pathMatch: 'full',
  },
];
