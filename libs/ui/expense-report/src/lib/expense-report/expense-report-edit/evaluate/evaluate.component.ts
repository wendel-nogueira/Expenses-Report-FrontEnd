/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { ExpenseReport } from 'libs/models/ExpenseReport';
import { ContentComponent } from 'libs/ui/page/content/content.component';
import { ButtonGroupComponent } from 'libs/ui/buttons/button-group/button-group.component';
import { FlatButtonComponent } from 'libs/ui/buttons/flat-button/flat-button.component';
import { FormComponent } from 'libs/ui/forms/form/form.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { TextFieldComponent } from 'libs/ui/forms/text-field/text-field.component';
import { ExpenseReportService } from 'libs/services/expense-report/expense-report.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-evaluate',
  standalone: true,
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.css'],
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
export class EvaluateComponent {
  expenseReport: ExpenseReport;
  currentUrl = this.router.url;
  notes = ''

  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: {
      expenseReport: ExpenseReport;
    },
    private expenseReportService: ExpenseReportService,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,
    private router: Router
  ) {
    this.expenseReport = data.expenseReport;
  }

  onSubmit(status: number) {
    const expenseReportToEvaluate = this.expenseReport;

    expenseReportToEvaluate.status = status;
    expenseReportToEvaluate.statusNotes = this.notes;

    this.expenseReportService.updateExpenseReport(expenseReportToEvaluate).subscribe(
      () => {
        this.matDialog.closeAll();

        this.matSnackBar.open('Expense report evaluated!', '', {
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

        this.matSnackBar.open('Error evaluating expense report!', '', {
          duration: 4000,
          panelClass: ['red-snackbar'],
        });
      }
    );
  }
}
