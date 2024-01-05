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
import { ExpenseAccountService } from '../../../../../../services/expense-account/expense-account.service';
import { ExportService } from '../../../../../../services/export/export.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'lib-expense-account-list',
  standalone: true,
  templateUrl: './expense-account-list.component.html',
  styleUrls: ['./expense-account-list.component.css'],
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
export class ExpenseAccountListComponent implements OnInit {
  searchValue: string;
  rows: rows[] = [];
  rowsFiltered: rows[] = [];
  columns: tableColumns[] = [
    { name: 'name', label: 'Name' },
    { name: 'code', label: 'Code' },
    { name: 'type', label: 'Type' },
    { name: 'active', label: 'Active' },
    { name: 'actions', label: 'Actions' },
  ];
  loading = true;

  data: MatTableDataSource<rows>;

  loadingExport = false;

  constructor(
    private expenseAccountService: ExpenseAccountService,
    private exportService: ExportService
  ) {
    this.searchValue = '';

    this.data = new MatTableDataSource<rows>(this.rows);
  }

  ngOnInit(): void {
    this.getExpenseAccounts();
  }

  getExpenseAccounts() {
    this.expenseAccountService.getExpenseAccounts().subscribe((data) => {
      this.rows = data.map((expenseAccount) => {
        return {
          id: expenseAccount.id,
          name: expenseAccount.name,
          code: expenseAccount.code,
          type: expenseAccount.type === 0 ? 'Asset' : 'Expense',
          active: expenseAccount.isDeleted ? 'No' : 'Yes',
          actions: {
            href: `/expense-accounts/edit/${expenseAccount.id}`,
            icon: 'edit',
            style: 'bg-blue-400 hover:bg-blue-500',
          },
        };
      });

      this.data = new MatTableDataSource<rows>(this.rows);
      this.loading = false;
    });
  }

  onChangeValue(value: string) {
    this.searchValue = value;
    this.loading = true;

    this.rowsFiltered = this.rows.filter((row) => {
      return (
        row.name.toLowerCase().includes(value.toLowerCase()) ||
        row.code.toLowerCase().includes(value.toLowerCase()) ||
        row.type.toLowerCase().includes(value.toLowerCase()) ||
        row.active.toLowerCase().includes(value.toLowerCase())
      );
    });

    if (this.searchValue === '')
      this.data = new MatTableDataSource<rows>(this.rows);
    else this.data = new MatTableDataSource<rows>(this.rowsFiltered);

    this.loading = false;
  }

  exportData() {
    this.loadingExport = true;

    this.exportService.exportExpenseAccounts().subscribe((data) => {
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
  name: string;
  code: string;
  type: string;
  active: string;
  actions?: {
    href: string;
    icon: string;
    style: string;
  };
}
