/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
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
  ],
})
export class ExpenseReportNewComponent {
  departament = '';
  departamentIsInvalid = true;
  project = '';
  projectIsInvalid = true;
  totalAmount = 0;
  totalAmountIsInvalid = false;

  allDepartaments: Departament[] = [];
  departaments: SelectOption[] = [];
  allProjects: Project[] = [];
  projects: SelectOption[] = [];

  expenses: Expense[] = [];

  constructor(
    private expenseReportService: ExpenseReportService,
    private departamentService: DepartamentService,
    private projectService: ProjectService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    this.getDepartaments();
    this.getProjects();
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
    this.departament = departament;

    if (this.departamentIsInvalid) return;

    const allProjects: SelectOption[] = [];

    this.allProjects.forEach((project) => {
      if (project.isDeleted) return;

      if (project.departamentId === this.departament) {
        allProjects.push({
          value: project.id as string,
          viewValue: project.name,
        });
      }
    });

    this.projects = allProjects;
    this.project = '';
    this.projectIsInvalid = true;
  }

  onAddExpense(event: Event) {
    console.log(event);
    event.preventDefault();
    console.log('Add expense');

    const expense: Expense = {
      id: '',
      amount: 0,
      explanation: '',
      dateIncurred: new Date(),
    };

    this.expenses.push(expense);
  }

  onRemoveExpense(expense: Expense) {
    console.log('Remove expense');
    console.log(expense);
  }

  onSubmit() {
    if (
      this.departamentIsInvalid ||
      this.projectIsInvalid ||
      this.totalAmountIsInvalid
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
  }
}