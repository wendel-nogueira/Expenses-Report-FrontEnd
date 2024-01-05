/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';
import { FieldStaffGuard } from 'libs/guard/fieldStaff/field-staff.guard';

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
    canActivate: [FieldStaffGuard],
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
