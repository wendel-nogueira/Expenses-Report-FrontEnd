/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExpenseReport } from 'libs/models/ExpenseReport';
import { AuthService } from 'libs/services/auth/auth.service';
import { UserService } from 'libs/services/user/user.service';
import { ContentComponent } from 'libs/ui/page/content/content.component';
import { ButtonGroupComponent } from 'libs/ui/buttons/button-group/button-group.component';
import { FlatButtonComponent } from 'libs/ui/buttons/flat-button/flat-button.component';
import { FormComponent } from 'libs/ui/forms/form/form.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { TextFieldComponent } from 'libs/ui/forms/text-field/text-field.component';
import { ExpenseReportService } from 'libs/services/expense-report/expense-report.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InputFileComponent } from 'libs/ui/forms/input-file/input-file.component';

@Component({
  selector: 'lib-pay',
  standalone: true,
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css'],
  imports: [
    CommonModule,
    ContentComponent,
    ButtonGroupComponent,
    FlatButtonComponent,
    FormComponent,
    FormGroupComponent,
    TextFieldComponent,
    InputFileComponent,
    MatSnackBarModule,
    MatDialogModule,
  ],
})
export class PayComponent implements OnInit {
  expenseReport: ExpenseReport;
  loading = false;
  currentUrl = this.router.url;
  evaluated = false;
  userId = '';

  proofOfPaymentIsInvalid = true;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: {
      expenseReport: ExpenseReport;
    },
    private authService: AuthService,
    private userService: UserService,
    private expenseReportService: ExpenseReportService,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,
    private router: Router
  ) {
    this.expenseReport = data.expenseReport;
  }

  ngOnInit(): void {
    const identity = this.authService.getIdentity();

    if (identity) {
      this.loading = true;
      this.userService
        .getUserByIdentityId(identity.nameid)
        .subscribe((user) => {
          this.userId = user.id as string;
          this.loading = false;
        });
    }
  }

  onSubmit(status: number) {
    if (this.proofOfPaymentIsInvalid) {
      this.matSnackBar.open(
        'Invalid fields! Check that the fields have been filled in correctly.',
        '',
        {
          duration: 4000,
          panelClass: ['red-snackbar'],
        }
      );

      return;
    }

    const expenseReportToPay = this.expenseReport;

    expenseReportToPay.status = status;
    expenseReportToPay.amountPaid =
      status === 3 ? this.expenseReport.amountApproved : 0;
    expenseReportToPay.paidById = this.userId;
    expenseReportToPay.paidDateTimeZone =
      Intl.DateTimeFormat().resolvedOptions().timeZone;
    expenseReportToPay.paidDate = new Date();

    this.expenseReportService.updateExpenseReport(expenseReportToPay).subscribe(
      () => {
        this.matDialog.closeAll();

        this.matSnackBar.open('Expense paid!', '', {
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

        this.matSnackBar.open('Error paying expense!', '', {
          duration: 4000,
          panelClass: ['red-snackbar'],
        });
      }
    );
  }
}
