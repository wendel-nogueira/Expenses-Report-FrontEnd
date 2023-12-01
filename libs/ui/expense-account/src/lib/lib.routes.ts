/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';
import { AccountantGuard } from 'libs/guard/accountant/accountant.guard';

export const expenseAccountRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./expense-account/expense-account.component').then(
        (m) => m.ExpenseAccountComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'new',
    loadComponent: () =>
      import(
        './expense-account/expense-account-new/expense-account-new.component'
      ).then((m) => m.ExpenseAccountNewComponent),
    pathMatch: 'full',
    canActivate: [AccountantGuard],
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import(
        './expense-account/expense-account-edit/expense-account-edit.component'
      ).then((m) => m.ExpenseAccountEditComponent),
    pathMatch: 'full',
    canActivate: [AccountantGuard],
  },
];
