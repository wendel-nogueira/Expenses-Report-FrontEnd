/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Expense } from 'libs/models/Expense';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { AuthService } from 'libs/services/auth/auth.service';
import { UserService } from 'libs/services/user/user.service';
import { ContentComponent } from 'libs/ui/page/content/content.component';
import { ButtonGroupComponent } from 'libs/ui/buttons/button-group/button-group.component';
import { FlatButtonComponent } from 'libs/ui/buttons/flat-button/flat-button.component';
import { FormComponent } from 'libs/ui/forms/form/form.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { TextFieldComponent } from 'libs/ui/forms/text-field/text-field.component';
import { ExpenseService } from 'libs/services/expense/expense.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-expense-evaluate',
  standalone: true,
  templateUrl: './expense-evaluate.component.html',
  styleUrls: ['./expense-evaluate.component.css'],
  imports: [
    CommonModule,
    ContentComponent,
    ButtonGroupComponent,
    FlatButtonComponent,
    FormComponent,
    FormGroupComponent,
    TextFieldComponent,
    MatSnackBarModule,
    MatDialogModule,
  ],
})
export class ExpenseEvaluateComponent implements OnInit {
  expense: Expense;
  loading = false;
  currentUrl = this.router.url;
  evaluated = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: {
      expense: Expense;
      evaluated: boolean;
    },
    private authService: AuthService,
    private userService: UserService,
    private expenseService: ExpenseService,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,
    private router: Router
  ) {
    this.expense = data.expense;
    this.evaluated = data.evaluated;
  }

  ngOnInit(): void {
    const identity = this.authService.getIdentity();

    if (identity) {
      this.loading = true;
      this.userService
        .getUserByIdentityId(identity.nameid)
        .subscribe((user) => {
          this.expense.actionBy = user.id;
          this.expense.actionDateTimeZone =
            Intl.DateTimeFormat().resolvedOptions().timeZone;

          this.loading = false;
        });
    }
  }

  approveExpense() {
    this.expense.status = 0;
    this.onSubmit();
  }

  rejectExpense() {
    this.expense.status = 1;
    this.onSubmit();
  }

  onSubmit() {
    if (this.expense.accountingNotes === '') {
      this.matSnackBar.open('Accounting notes are required!', '', {
        duration: 4000,
        panelClass: ['red-snackbar'],
      });

      return;
    }

    this.expense.actionDate = new Date();

    this.expenseService.evaluateExpense(this.expense).subscribe(
      () => {
        this.matDialog.closeAll();

        this.matSnackBar.open('Expense evaluated!', '', {
          duration: 4000,
          panelClass: ['green-snackbar'],
        });

        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate([this.currentUrl]);
          });
      },
      (error) => {
        console.log(error);

        this.matSnackBar.open('Error evaluating expense!', '', {
          duration: 4000,
          panelClass: ['red-snackbar'],
        });
      }
    );
  }
}
