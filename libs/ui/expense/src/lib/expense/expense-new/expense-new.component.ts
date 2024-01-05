/* eslint-disable @nx/enforce-module-boundaries */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Expense } from 'libs/models/Expense';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HeaderComponent } from 'libs/ui/page/header/header.component';
import { ContentComponent } from 'libs/ui/page/content/content.component';
import { FormComponent } from 'libs/ui/forms/form/form.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { InputTextComponent } from 'libs/ui/forms/input-text/input-text.component';
import { InputDateComponent } from 'libs/ui/forms/input-date/input-date.component';
import { InputMoneyComponent } from 'libs/ui/forms/input-money/input-money.component';
import { InputFileComponent } from 'libs/ui/forms/input-file/input-file.component';
import { ButtonGroupComponent } from 'libs/ui/buttons/button-group/button-group.component';
import { FlatButtonComponent } from 'libs/ui/buttons/flat-button/flat-button.component';
import { TextFieldComponent } from 'libs/ui/forms/text-field/text-field.component';
import { ExpenseAccount } from 'libs/models/ExpenseAccount';
import {
  SelectComponent,
  SelectOption,
} from 'libs/ui/forms/select/select.component';
import { ExpenseAccountService } from 'libs/services/expense-account/expense-account.service';

@Component({
  selector: 'lib-expense-new',
  standalone: true,
  templateUrl: './expense-new.component.html',
  styleUrls: ['./expense-new.component.css'],
  imports: [
    CommonModule,
    HeaderComponent,
    ContentComponent,
    FormComponent,
    FormGroupComponent,
    InputTextComponent,
    InputDateComponent,
    InputMoneyComponent,
    InputFileComponent,
    ButtonGroupComponent,
    FlatButtonComponent,
    TextFieldComponent,
    SelectComponent,
  ],
})
export class ExpenseNewComponent implements OnInit {
  @Output() expenseCreated = new EventEmitter<Expense>();
  @Output() cancelCreate = new EventEmitter<void>();

  expense: Expense = {
    expenseAccount: '',
    amount: 0,
    dateIncurred: new Date(),
    explanation: '',
    dateIncurredTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    receipt: '',
  };

  expenseAccountIsInvalid = true;
  amountIsInvalid = true;
  dateIncurredIsInvalid = true;
  receiptIsInvalid = true;

  allExpenseAccounts: ExpenseAccount[] = [];
  expenseAccounts: SelectOption[] = [];

  constructor(
    private expenseAccountService: ExpenseAccountService,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.expenseAccountService
      .getExpenseAccounts()
      .subscribe((expenseAccounts) => {
        this.allExpenseAccounts = expenseAccounts;

        expenseAccounts.forEach((expenseAccount) => {
          if (!expenseAccount.isDeleted) {
            this.expenseAccounts.push({
              value: expenseAccount.id as string,
              viewValue:
                expenseAccount.code +
                ' - ' +
                (expenseAccount.type === 0 ? 'Asset' : 'Expense'),
            });
          }
        });
      });
  }

  amountChangeValue(value: string) {
    this.expense.amount = parseFloat(value);
    this.amountIsInvalid = false;
  }

  onSubmit() {
    if (
      this.expenseAccountIsInvalid ||
      this.amountIsInvalid ||
      this.receiptIsInvalid ||
      this.dateIncurredIsInvalid
    ) {
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

    this.expenseCreated.emit(this.expense);
  }

  onCancel() {
    this.cancelCreate.emit();
  }
}
