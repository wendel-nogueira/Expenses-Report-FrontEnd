/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { InputSearchComponent } from '../../../../../forms/input-search/input-search.component';
import {
  TableComponent,
  tableColumns,
} from '../../../../../data-table/table/table.component';
import { ExpenseReportService } from '../../../../../../services/expense-report/expense-report.service';
import { UserService } from '../../../../../../services/user/user.service';
import { DepartamentService } from '../../../../../../services/departament/departament.service';
import { ProjectService } from '../../../../../../services/project/project.service';
import { ExpenseReportStatus } from '../../../../../../enums/ExpenseReportStatus';
import { ExportService } from '../../../../../../services/export/export.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../../../services/auth/auth.service';

@Component({
  selector: 'lib-expense-report-list',
  standalone: true,
  templateUrl: './expense-report-list.component.html',
  styleUrls: ['./expense-report-list.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    RouterModule,
    InputSearchComponent,
    TableComponent,
    MatProgressSpinnerModule,
  ],
})
export class ExpenseReportListComponent implements OnInit {
  searchValue: string;
  rows: rows[] = [];
  rowsFiltered: rows[] = [];
  columns: tableColumns[] = [
    { name: 'user', label: 'User' },
    { name: 'departament', label: 'Departament' },
    { name: 'project', label: 'Project' },
    { name: 'totalAmount', label: 'Total Amount' },
    { name: 'status', label: 'Status' },
    { name: 'actions', label: 'Actions' },
  ];
  loading = true;

  data: MatTableDataSource<rows>;

  loadingExport = false;
  isFieldStaff = false;

  constructor(
    private expenseReportService: ExpenseReportService,
    private userService: UserService,
    private departamentService: DepartamentService,
    private projectService: ProjectService,
    private exportService: ExportService,
    private authService: AuthService
  ) {
    this.searchValue = '';

    this.data = new MatTableDataSource<rows>(this.rows);
  }

  ngOnInit(): void {
    const role = this.authService.getIdentity()?.role as string;

    this.isFieldStaff = role === 'FieldStaff';

    this.getExpenseReports();
  }

  async getUserName(id: string) {
    return await this.userService
      .getUserById(id)
      .toPromise()
      .then((data) => {
        return data?.name.firstName + ' ' + data?.name.lastName;
      });
  }

  getExpenseReports() {
    this.expenseReportService.getExpenseReports().subscribe((data) => {
      this.userService.getUsers().subscribe((users) => {
        this.departamentService.getDepartaments().subscribe((departaments) => {
          this.projectService.getProjects().subscribe((projects) => {
            this.rows = data.map((expenseReport) => {
              return {
                id: expenseReport.id,
                user:
                  users.find((user) => user.id === expenseReport.userId)?.name
                    .firstName +
                    ' ' +
                    users.find((user) => user.id === expenseReport.userId)?.name
                      .lastName ?? 'No user',
                departament:
                  departaments.find(
                    (departament) =>
                      departament.id === expenseReport.departamentId
                  )?.name ?? 'No departament',
                project:
                  projects.find(
                    (project) => project.id === expenseReport.projectId
                  )?.name ?? 'No project',
                totalAmount: expenseReport.totalAmount,
                status:
                  expenseReport.status !== undefined
                    ? this.findStatusByEnum(expenseReport.status)
                    : 'No status',
                actions: {
                  href: `/expense-reports/edit/${expenseReport.id}`,
                  icon: 'edit',
                  style: 'bg-blue-400 hover:bg-blue-500',
                },
              };
            });

            this.data = new MatTableDataSource<rows>(this.rows);
            this.loading = false;
          });
        });
      });
    });
  }

  onChangeValue(value: string) {
    this.searchValue = value;
    this.loading = true;

    this.rowsFiltered = this.rows.filter((row) => {
      return (
        row.user.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        row.departament
          .toLowerCase()
          .includes(this.searchValue.toLowerCase()) ||
        row.project.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        row.status.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    });

    if (this.searchValue === '')
      this.data = new MatTableDataSource<rows>(this.rows);
    else this.data = new MatTableDataSource<rows>(this.rowsFiltered);

    this.loading = false;
  }

  findStatusByEnum(status: number) {
    if (status === 1) return 'Approved by supervisor';
    else if (status === 2) return 'Rejected by supervisor';
    else if (status === 4) return 'Payment rejected';

    return ExpenseReportStatus[status];
  }

  exportData() {
    this.loadingExport = true;

    this.exportService.exportExpenseReports().subscribe((data) => {
      const uri = data.uri as string;

      window.open(uri);

      this.loadingExport = false;
    }, (error) => {
      console.log(error);

      this.loadingExport = false;
    });
  }
}

interface rows {
  id?: string;
  user: string;
  departament: string;
  project: string;
  totalAmount: number;
  status: string;
  actions?: {
    href: string;
    icon: string;
    style: string;
  };
}
