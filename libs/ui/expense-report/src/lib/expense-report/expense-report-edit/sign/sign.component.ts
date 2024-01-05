/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Inject, OnInit } from '@angular/core';
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
import { InputTextComponent } from 'libs/ui/forms/input-text/input-text.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Signature } from 'libs/models/Signature';
import { SignatureService } from 'libs/services/signature/signature.service';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-sign',
  standalone: true,
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css'],
  imports: [
    CommonModule,
    ContentComponent,
    ButtonGroupComponent,
    FlatButtonComponent,
    FormComponent,
    FormGroupComponent,
    InputTextComponent,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
})
export class SignComponent implements OnInit {
  expenseReport: ExpenseReport;

  signature: Signature = {
    name: '',
    acceptance: false,
    ipAddress: '',
    signatureDate: new Date(),
    signatureDateTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  nameIsInvalid = true;
  currentUrl = this.router.url;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: {
      expenseReport: ExpenseReport;
    },
    private signatureService: SignatureService,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,
    private router: Router
  ) {
    this.expenseReport = data.expenseReport;
  }

  ngOnInit(): void {
    this.signatureService.getIp().subscribe((data) => {
      this.signature.ipAddress = data.ip;
    });
  }

  signExpenseReport() {
    console.log(this.expenseReport);
    if (this.expenseReport.id === undefined) {
      return;
    }

    if (this.nameIsInvalid || !this.signature.acceptance) {
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

    this.signature.signatureDate = new Date();

    console.log('signExpenseReport');
    console.log(this.signature);

    this.signatureService
      .signExpenseReport(this.expenseReport.id, this.signature)
      .subscribe(
        () => {
          this.matDialog.closeAll();

          this.matSnackBar.open('Expense report signed!', '', {
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

          this.matSnackBar.open('Error signing expense report!', '', {
            duration: 4000,
            panelClass: ['red-snackbar'],
          });
        }
      );
  }
}
