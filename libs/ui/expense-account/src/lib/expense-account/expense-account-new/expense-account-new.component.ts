/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ExpenseAccountService } from 'libs/services/expense-account/expense-account.service';
import { ExpenseAccount } from 'libs/models/ExpenseAccount';
import { HeaderComponent } from 'libs/ui/page/header/header.component';
import { ContentComponent } from 'libs/ui/page/content/content.component';
import { FormComponent } from 'libs/ui/forms/form/form.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { ButtonGroupComponent } from 'libs/ui/buttons/button-group/button-group.component';
import { RedirectButtonComponent } from 'libs/ui/buttons/redirect-button/redirect-button.component';
import { FlatButtonComponent } from 'libs/ui/buttons/flat-button/flat-button.component';
import { InputTextComponent } from 'libs/ui/forms/input-text/input-text.component';
import { TextFieldComponent } from 'libs/ui/forms/text-field/text-field.component';
import {
  SelectComponent,
  SelectOption,
} from 'libs/ui/forms/select/select.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'lib-expense-account-new',
  standalone: true,
  templateUrl: './expense-account-new.component.html',
  styleUrls: ['./expense-account-new.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    ContentComponent,
    FormComponent,
    FormGroupComponent,
    InputTextComponent,
    SelectComponent,
    TextFieldComponent,
    FlatButtonComponent,
    RedirectButtonComponent,
    ButtonGroupComponent,
    MatSnackBarModule,
  ],
})
export class ExpenseAccountNewComponent {
  name = '';
  nameIsInvalid = true;
  code = '';
  codeIsInvalid = true;
  codeExists = false;
  type = '';
  typeIsInvalid = true;
  description = '';

  types: SelectOption[] = [
    {
      value: '0',
      viewValue: 'Asset',
    },
    {
      value: '1',
      viewValue: 'Expense',
    },
  ];

  constructor(
    private expenseAccountService: ExpenseAccountService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {}

  codeChangeValue(code: string) {
    if (this.codeIsInvalid) return;

    this.codeExists = false;
    this.code = code;

    this.expenseAccountService.checkCodeExists(code).subscribe((exists) => {
      if (exists) {
        this.codeExists = true;
      }
    });
  }

  onSubmit() {
    if (this.nameIsInvalid || this.codeIsInvalid || this.typeIsInvalid) {
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

    const newExpenseAccount: ExpenseAccount = {
      name: this.name,
      code: this.code,
      type: parseInt(this.type),
      description: this.description,
    };

    this.expenseAccountService
      .createExpenseAccount(newExpenseAccount)
      .subscribe(
        () => {
          this.matSnackBar.open('Expense Account created successfully!', '', {
            duration: 4000,
            panelClass: ['green-snackbar'],
          });

          this.router.navigate(['/expense-accounts']);
        },
        (error) => {
          this.matSnackBar.open(error.message, '', {
            duration: 4000,
            panelClass: ['red-snackbar'],
          });
        }
      );
  }
}
