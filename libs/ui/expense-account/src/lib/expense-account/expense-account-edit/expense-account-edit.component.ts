/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
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
  selector: 'lib-expense-account-edit',
  standalone: true,
  templateUrl: './expense-account-edit.component.html',
  styleUrls: ['./expense-account-edit.component.css'],
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
export class ExpenseAccountEditComponent implements OnInit {
  id: string | null = null;
  expenseAccount: ExpenseAccount | null = null;
  loading = true;
  currentUrl = this.router.url;

  name = '';
  nameIsInvalid = false;
  code = '';
  codeIsInvalid = false;
  codeExists = false;
  type = '';
  typeIsInvalid = false;
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
    private matSnackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');

      if (this.id) {
        this.getExpenseAccount();
      }
    });
  }

  getExpenseAccount() {
    this.expenseAccountService
      .getExpenseAccountById(this.id as string)
      .subscribe((expenseAccount) => {
        this.expenseAccount = expenseAccount;

        this.name = this.expenseAccount.name;
        this.code = this.expenseAccount.code;
        this.description = this.expenseAccount.description;
        this.type = this.expenseAccount.type as unknown as string;

        this.loading = false;
      });
  }

  codeChangeValue(code: string) {
    if (this.codeIsInvalid) return;

    this.codeExists = false;
    this.code = code;

    this.expenseAccountService.checkCodeExists(code).subscribe((exists) => {
      if (exists && exists.id !== this.id) {
        this.codeExists = true;
      }
    });
  }

  typeChangeValue(type: string) {
    this.type = type;
    this.typeIsInvalid = false;

    if (this.expenseAccount)
      this.expenseAccount.type = parseInt(type as unknown as string);
  }

  onSubmit() {
    if (
      !this.id ||
      !this.expenseAccount ||
      this.nameIsInvalid ||
      this.codeIsInvalid ||
      this.codeExists ||
      this.typeIsInvalid
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

    this.expenseAccountService
      .updateExpenseAccount(this.id as string, this.expenseAccount)
      .subscribe(
        () => {
          this.matSnackBar.open('Expense account updated successfully!', '', {
            duration: 4000,
            panelClass: ['green-snackbar'],
          });

          this.router.navigate(['/expense-accounts']);
        },
        () => {
          this.matSnackBar.open('Error updating expense account!', '', {
            duration: 4000,
            panelClass: ['red-snackbar'],
          });
        }
      );
  }

  onDeactivate() {
    if (!this.id) return;

    this.expenseAccountService.deactivateProject(this.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    });
  }

  onActivate() {
    if (!this.id) return;

    this.expenseAccountService.activateProject(this.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    });
  }
}
