/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseNewComponent } from 'libs/ui/expense/src/lib/expense/expense-new/expense-new.component';
import { Departament } from 'libs/models/Departament';
import { Project } from 'libs/models/Project';
import { ExpenseAccount } from 'libs/models/ExpenseAccount';
import { ExpenseReport } from 'libs/models/ExpenseReport';
import { AuthService } from 'libs/services/auth/auth.service';
import { UserService } from 'libs/services/user/user.service';
import { ExpenseReportService } from 'libs/services/expense-report/expense-report.service';
import { DepartamentService } from 'libs/services/departament/departament.service';
import { ProjectService } from 'libs/services/project/project.service';
import { ExpenseAccountService } from 'libs/services/expense-account/expense-account.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Expense } from 'libs/models/Expense';

@Component({
  selector: 'lib-expense-report-edit',
  standalone: true,
  templateUrl: './expense-report-edit.component.html',
  styleUrls: ['./expense-report-edit.component.css'],
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
export class ExpenseReportEditComponent implements OnInit {
  allDepartaments: Departament[] = [];
  departaments: SelectOption[] = [];
  allProjects: Project[] = [];
  projects: SelectOption[] = [];
  allExpenseAccounts: ExpenseAccount[] = [];

  expenseReport: ExpenseReport = {
    userId: '',
    departamentId: '',
    projectId: '',
    totalAmount: 0,
    amountApproved: 0,
    amountRejected: 0,
    expenses: [],
  };
  departamentIsInvalid = false;
  projectIsInvalid = false;

  viewExpense = false;
  loading = true;
  loadingDepartaments = true;
  loadingProjects = true;
  loadingExpenseAccounts = true;

  constructor(
    private expenseReportService: ExpenseReportService,
    private departamentService: DepartamentService,
    private projectService: ProjectService,
    private router: Router,
    private expenseAccountService: ExpenseAccountService,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.expenseAccountService
      .getExpenseAccounts()
      .subscribe((expenseAccounts) => {
        this.allExpenseAccounts = expenseAccounts;
        this.loadingExpenseAccounts = false;      });

    this.getDepartaments();
    this.getProjects();

    this.expenseReportService
      .getExpenseReportById('657bcf399c1b538785390495')
      .subscribe((expenseReport) => {
        this.expenseReport = expenseReport;
        this.loading = false;

        this.departamentChangeValue(expenseReport.departamentId as string, false);
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
      this.loadingDepartaments = false;
    });
  }

  getProjects() {
    this.projectService.getProjects().subscribe((projects) => {
      this.allProjects = projects;
      this.loadingProjects = false;
    });
  }

  departamentChangeValue(departament: string, resetProject = true) {
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

    if (resetProject) {
      this.expenseReport.projectId = '';
      this.projectIsInvalid = true;
    }
  }

  onSubmit() {
    console.log(this.expenseReport);
  }

  onAddExpense(event: any) {
    console.log(event);
  }

  onRemoveExpense(expense: Expense) {
    console.log(expense);
  }

  findExpenseAccountById(id: string) {
    return this.allExpenseAccounts.find((ea) => ea.id === id);
  }
}
