/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
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
import { ExpenseService } from 'libs/services/expense/expense.service';
import { DepartamentService } from 'libs/services/departament/departament.service';
import { ProjectService } from 'libs/services/project/project.service';
import { ExpenseAccountService } from 'libs/services/expense-account/expense-account.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Expense } from 'libs/models/Expense';
import {
  TableComponent,
  tableColumns,
} from 'libs/ui/data-table/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
import { ExpenseReportStatus } from 'libs/enums/ExpenseReportStatus';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SignComponent } from './sign/sign.component';
import { EvaluateComponent } from './evaluate/evaluate.component';
import { PayComponent } from './pay/pay.component';
import { ExpenseEvaluateComponent } from './expense-evaluate/expense-evaluate.component';
import { ExportService } from 'libs/services/export/export.service';

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
    ButtonGroupComponent,
    FlatButtonComponent,
    RedirectButtonComponent,
    MatSnackBarModule,
    MatExpansionModule,
    MatIconModule,
    ExpenseNewComponent,
    TableComponent,
    MatDialogModule,
  ],
})
export class ExpenseReportEditComponent implements OnInit {
  id: string | null = null;
  allDepartaments: Departament[] = [];
  departaments: SelectOption[] = [];
  allProjects: Project[] = [];
  projects: SelectOption[] = [];
  allExpenseAccounts: ExpenseAccount[] = [];

  userId = '';

  expenseReport: ExpenseReport = {
    userId: '',
    departamentId: '',
    projectId: '',
    totalAmount: 0,
    amountApproved: 0,
    amountRejected: 0,
    amountPaid: 0,
    expenses: [],
  };
  departamentIsInvalid = false;
  projectIsInvalid = false;

  viewExpense = false;
  loading = true;
  loadingDepartaments = true;
  loadingProjects = true;
  loadingExpenseAccounts = true;

  rowsExpenses: rowsExpenses[] = [];
  columnsExpenses: tableColumns[] = [
    { name: 'expenseAccount', label: 'Expense Account' },
    { name: 'amount', label: 'Amount' },
    { name: 'dateIncurred', label: 'Date Incurred' },
    { name: 'explanation', label: 'Explanation' },
    { name: 'status', label: 'Status' },
    { name: 'functions', label: 'Actions' },
  ];
  dataExpenses: MatTableDataSource<rowsExpenses>;

  rowsSignatures: rowsSignatures[] = [];
  columnsSignatures: tableColumns[] = [
    { name: 'name', label: 'Name' },
    { name: 'acceptance', label: 'Acceptance' },
    { name: 'signatureDate', label: 'Signature Date' },
    { name: 'ipAddress', label: 'IP Address' },
  ];
  dataSignatures: MatTableDataSource<rowsSignatures>;

  selected = 'expenses';
  createExpense = false;

  allowEdit = false;
  allowEvaluate = false;
  allowPay = false;
  allowEvaluateExpense = false;
  role = this.authService.getIdentity()?.role;

  loadingExport = false;

  constructor(
    private expenseReportService: ExpenseReportService,
    private expenseService: ExpenseService,
    private departamentService: DepartamentService,
    private projectService: ProjectService,
    private expenseAccountService: ExpenseAccountService,
    private authService: AuthService,
    private userService: UserService,
    private exportService: ExportService,
    private router: Router,
    private route: ActivatedRoute,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog
  ) {
    this.dataExpenses = new MatTableDataSource<rowsExpenses>(this.rowsExpenses);
    this.dataSignatures = new MatTableDataSource<rowsSignatures>(
      this.rowsSignatures
    );
  }

  ngOnInit(): void {
    const identity = this.authService.getIdentity();

    if (identity)
      this.userService
        .getUserByIdentityId(identity.nameid)
        .subscribe((user) => {
          this.userId = user.id as string;

          this.allowEvaluate = this.role === 'Manager';
          this.allowPay = this.role === 'Accountant';
          this.allowEvaluateExpense = this.role === 'Accountant';
        });

    this.expenseAccountService
      .getExpenseAccounts()
      .subscribe((expenseAccounts) => {
        this.allExpenseAccounts = expenseAccounts;
        this.loadingExpenseAccounts = false;
      });

    this.getDepartaments();
    this.getProjects();

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');

      if (this.id) {
        this.expenseReportService
          .getExpenseReportById(this.id as string)
          .subscribe((expenseReport) => {
            this.expenseReport = expenseReport;
            this.allowEdit = expenseReport.status === 0 && this.userId === expenseReport.userId;
            this.loading = false;

            this.departamentChangeValue(
              expenseReport.departamentId as string,
              false
            );

            const rowsExpenses: rowsExpenses[] = [];

            expenseReport.expenses.forEach((expense) => {
              const expenseInfo = {
                expenseAccount: this.findExpenseAccountById(
                  expense.expenseAccount
                )?.name as string,
                amount:
                  '$ ' +
                  expense.amount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                dateIncurred: new Date(
                  expense.dateIncurred
                ).toLocaleDateString(),
                explanation: expense.explanation || 'No explanation',
                status:
                  expense.status === 0
                    ? 'Approved'
                    : expense.status === 1
                    ? 'Rejected'
                    : 'Pending',
                functions: [
                  {
                    icon: 'eye',
                    style: 'bg-blue-400 hover:bg-blue-500',
                    function: () => {
                      if (!expense.receipt) return;
                      window.open(expense.receipt, '_blank');
                    },
                  },
                ],
              };

              if (this.allowEvaluateExpense)
                expenseInfo.functions.push({
                  icon: 'receipt',
                  style:
                    expense.status === null
                      ? 'bg-green-400 hover:bg-green-500'
                      : 'bg-yellow-400 hover:bg-yellow-500',
                  function: () => {
                    this.matDialog.open(ExpenseEvaluateComponent, {
                      data: {
                        expense: expense,
                        evaluated: expense.status !== null,
                      },
                    });
                  },
                });

              if (expense.status === null && this.allowEdit) {
                expenseInfo.functions.push({
                  icon: 'edit',
                  style: 'bg-blue-400 hover:bg-blue-500',
                  function: () => {
                    this.router.navigate([`/expenses/edit/${expense.id}`]);
                  },
                });

                expenseInfo.functions.push({
                  icon: 'cancel',
                  style: 'bg-red-400 hover:bg-red-500',
                  function: () => {
                    this.onRemoveExpense(expense);
                  },
                });
              }

              rowsExpenses.push(expenseInfo);
            });

            this.dataExpenses = new MatTableDataSource<rowsExpenses>(
              rowsExpenses
            );

            const rowsSignatures: rowsSignatures[] = [];

            expenseReport.signatures?.forEach((signature) => {
              rowsSignatures.push({
                name: signature.name,
                acceptance: signature.acceptance ? 'Accepted' : 'Not accepted',
                signatureDate: new Date(
                  signature.signatureDate
                ).toLocaleDateString(),
                ipAddress: signature.ipAddress,
              });
            });

            this.dataSignatures = new MatTableDataSource<rowsSignatures>(
              rowsSignatures
            );
          });
      }
    });
  }

  getDepartaments() {
    this.departamentService.getDepartaments().subscribe((departaments) => {
      this.allDepartaments = departaments;
      console.log(departaments);

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
      console.log(projects);
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

    this.expenseReportService.updateExpenseReport(this.expenseReport).subscribe(
      (expenseReport) => {
        this.expenseReport = expenseReport;

        this.matSnackBar.open('Expense report updated successfully!', '', {
          duration: 4000,
          panelClass: ['green-snackbar'],
        });
      },
      (error) => {
        console.log(error);

        this.matSnackBar.open('Error updating expense report!', '', {
          duration: 4000,
          panelClass: ['red-snackbar'],
        });
      }
    );
  }

  onAddExpense(expense: Expense) {
    this.expenseService.createExpense(this.id as string, expense).subscribe(
      (expense) => {
        this.expenseReport.expenses.push(expense);

        const expenseInfo = {
          expenseAccount: this.findExpenseAccountById(expense.expenseAccount)
            ?.name as string,
          amount:
            '$ ' +
            expense.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          dateIncurred: new Date(expense.dateIncurred).toLocaleDateString(),
          explanation: expense.explanation || 'No explanation',
          status:
            expense.status === 0
              ? 'Approved'
              : expense.status === 1
              ? 'Rejected'
              : 'Pending',
          functions: [
            {
              icon: 'eye',
              style: 'bg-blue-400 hover:bg-blue-500',
              function: () => {
                if (!expense.receipt) return;
                window.open(expense.receipt, '_blank');
              },
            },
          ],
        };

        if (this.allowEvaluateExpense)
          expenseInfo.functions.push({
            icon: 'receipt',
            style:
              expense.status === null
                ? 'bg-green-400 hover:bg-green-500'
                : 'bg-yellow-400 hover:bg-yellow-500',
            function: () => {
              this.matDialog.open(ExpenseEvaluateComponent, {
                data: {
                  expense: expense,
                  evaluated: expense.status !== null,
                },
              });
            },
          });

        if (expense.status === null && this.allowEdit) {
          expenseInfo.functions.push({
            icon: 'edit',
            style: 'bg-blue-400 hover:bg-blue-500',
            function: () => {
              this.router.navigate([`/expenses/edit/${expense.id}`]);
            },
          });

          expenseInfo.functions.push({
            icon: 'cancel',
            style: 'bg-red-400 hover:bg-red-500',
            function: () => {
              this.onRemoveExpense(expense);
            },
          });
        }

        this.dataExpenses.data.push(expenseInfo);

        this.expenseReport.totalAmount += expense.amount;

        this.dataExpenses._updateChangeSubscription();
        this.createExpense = false;
      },
      (error) => {
        console.log(error);

        this.matSnackBar.open('Error creating expense!', '', {
          duration: 4000,
          panelClass: ['red-snackbar'],
        });
      }
    );
  }

  onRemoveExpense(expense: Expense) {
    this.expenseService.deleteExpense(expense).subscribe(
      () => {
        const index = this.expenseReport.expenses.indexOf(expense);

        if (index > -1) {
          if (
            this.expenseReport.expenses[index].status === 0 &&
            this.expenseReport.amountApproved
          ) {
            this.expenseReport.amountApproved -= expense.amount;
          } else if (
            this.expenseReport.expenses[index].status === 1 &&
            this.expenseReport.amountRejected
          ) {
            this.expenseReport.amountRejected -= expense.amount;
          }

          this.expenseReport.expenses.splice(index, 1);
          this.dataExpenses.data.splice(index, 1);
          this.dataExpenses._updateChangeSubscription();

          this.expenseReport.totalAmount -= expense.amount;
        }

        this.matSnackBar.open('Expense deleted successfully!', '', {
          duration: 4000,
          panelClass: ['green-snackbar'],
        });
      },
      (error) => {
        console.log(error);

        this.matSnackBar.open('Error deleting expense!', '', {
          duration: 4000,
          panelClass: ['red-snackbar'],
        });
      }
    );
  }

  findExpenseAccountById(id: string) {
    return this.allExpenseAccounts.find((ea) => ea.id === id);
  }

  findStatusByEnum(status: number) {
    if (status === 1) return 'Approved by supervisor';
    else if (status === 2) return 'Rejected by supervisor';
    else if (status === 4) return 'Payment rejected';

    return ExpenseReportStatus[status];
  }

  signExpenseReport() {
    this.matDialog.open(SignComponent, {
      data: {
        expenseReport: this.expenseReport,
      },
    });
  }

  evaluateExpenseReport() {
    this.matDialog.open(EvaluateComponent, {
      data: {
        expenseReport: this.expenseReport,
      },
    });
  }

  payExpenseReport() {
    if (
      this.expenseReport.amountApproved === undefined ||
      this.expenseReport.amountRejected === undefined ||
      this.expenseReport.amountApproved + this.expenseReport.amountRejected <
        this.expenseReport.totalAmount
    ) {
      this.matSnackBar.open('Expenses not evaluated!', '', {
        duration: 4000,
        panelClass: ['red-snackbar'],
      });

      return;
    }

    if (this.expenseReport.status === 3 || this.expenseReport.status === 4) {
      this.matSnackBar.open('Expense report already paid!', '', {
        duration: 4000,
        panelClass: ['red-snackbar'],
      });

      return;
    }

    this.matDialog.open(PayComponent, {
      data: {
        expenseReport: this.expenseReport,
      },
    });
  }

  showProofOfPayment(proofOfPayment: string) {
    window.open(proofOfPayment, '_blank');
  }

  exportData() {
    if (!this.id) return;

    this.loadingExport = true;

    this.exportService.exportExpenseReport(this.id as string).subscribe((data) => {
      const uri = data.uri as string;

      window.open(uri);

      this.loadingExport = false;
    }, (error) => {
      console.log(error);

      this.loadingExport = false;
    });
  }
}

interface rowsExpenses {
  expenseAccount: string;
  amount: string;
  dateIncurred: string;
  explanation: string;
  status: string;
  functions?: functions[];
}

interface functions {
  icon: string;
  style: string;
  function: () => void;
}

interface rowsSignatures {
  name: string;
  acceptance: string;
  signatureDate: string;
  ipAddress: string;
}
