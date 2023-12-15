/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ExpenseReportService } from 'libs/services/expense-report/expense-report.service';
import { ExpenseReport } from 'libs/models/ExpenseReport';
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
import { DepartamentService } from 'libs/services/departament/departament.service';
import { ProjectService } from 'libs/services/project/project.service';
import { Departament } from 'libs/models/Departament';
import { Project } from 'libs/models/Project';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Expense } from 'libs/models/Expense';
import { AuthService } from 'libs/services/auth/auth.service';
import { UserService } from 'libs/services/user/user.service';
import { ExpenseNewComponent } from 'libs/ui/expense/src/lib/expense/expense-new/expense-new.component';
import { ExpenseAccount } from 'libs/models/ExpenseAccount';
import { ExpenseAccountService } from 'libs/services/expense-account/expense-account.service';

@Component({
  selector: 'lib-expense-report-new',
  standalone: true,
  templateUrl: './expense-report-new.component.html',
  styleUrls: ['./expense-report-new.component.css'],
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
    MatExpansionModule,
    MatIconModule,
    ExpenseNewComponent,
  ],
})
export class ExpenseReportNewComponent implements OnInit {
  allDepartaments: Departament[] = [];
  departaments: SelectOption[] = [];
  allProjects: Project[] = [];
  projects: SelectOption[] = [];
  createExpense = false;

  expenseReport: ExpenseReport = {
    userId: '',
    departamentId: '',
    projectId: '',
    totalAmount: 0,
    expenses: [],
  };
  departamentIsInvalid = true;
  projectIsInvalid = true;

  allExpenseAccounts: ExpenseAccount[] = [];

  constructor(
    private authService: AuthService,
    private usersService: UserService,
    private expenseReportService: ExpenseReportService,
    private departamentService: DepartamentService,
    private projectService: ProjectService,
    private router: Router,
    private expenseAccountService: ExpenseAccountService,
    private matSnackBar: MatSnackBar
  ) {
    this.getDepartaments();
    this.getProjects();
  }

  ngOnInit(): void {
    const identity = this.authService.getIdentity();

    if (identity)
      this.usersService
        .getUserByIdentityId(identity.nameid)
        .subscribe((user) => {
          this.expenseReport.userId = user.id as string;
        });

    this.expenseAccountService
      .getExpenseAccounts()
      .subscribe((expenseAccounts) => {
        this.allExpenseAccounts = expenseAccounts;
      });
  }

  getDepartaments() {
    this.departamentService.getDepartaments().subscribe((departaments) => {
      this.allDepartaments = departaments;

      const allDepartaments: SelectOption[] = [];

      this.allDepartaments.forEach((departament) => {
        if (departament.isDeleted) return;

        allDepartaments.push({
          value: departament.id as string,
          viewValue: departament.name,
        });
      });

      this.departaments = allDepartaments;
    });
  }

  getProjects() {
    this.projectService.getProjects().subscribe((projects) => {
      this.allProjects = projects;
    });
  }

  departamentChangeValue(departament: string) {
    this.expenseReport.departamentId = departament;

    if (this.departamentIsInvalid) return;

    const allProjects: SelectOption[] = [];

    this.allProjects.forEach((project) => {
      if (project.isDeleted) return;

      if (project.departamentId === this.expenseReport.departamentId) {
        allProjects.push({
          value: project.id as string,
          viewValue: project.name,
        });
      }
    });

    this.projects = allProjects;
    this.expenseReport.projectId = '';
    this.projectIsInvalid = true;
  }

  onAddExpense(expense: Expense) {
    this.expenseReport.expenses.push(expense);
    this.expenseReport.totalAmount += expense.amount;

    this.createExpense = false;
  }

  onRemoveExpense(expense: Expense) {
    const index = this.expenseReport.expenses.indexOf(expense);

    if (index > -1) {
      this.expenseReport.expenses.splice(index, 1);
      this.expenseReport.totalAmount -= expense.amount;
    }
  }

  onSubmit() {
    if (this.departamentIsInvalid || this.projectIsInvalid) {
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

    if (this.expenseReport.expenses.length === 0) {
      this.matSnackBar.open('You must add at least one expense.', '', {
        duration: 4000,
        panelClass: ['red-snackbar'],
      });

      return;
    }

    this.expenseReportService.createExpenseReport(this.expenseReport).subscribe(
      () => {
        this.matSnackBar.open('Expense Report created successfully!', '', {
          duration: 4000,
          panelClass: ['green-snackbar'],
        });

        this.router.navigate(['/expense-reports']);
      },
      (error) => {
        this.matSnackBar.open(error.message, '', {
          duration: 4000,
          panelClass: ['red-snackbar'],
        });
      }
    );
  }

  findExpenseAccountById(id: string) {
    return this.allExpenseAccounts.find((ea) => ea.id === id);
  }
}
