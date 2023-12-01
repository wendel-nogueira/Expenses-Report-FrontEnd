import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseReportListComponent } from './expense-report-list/expense-report-list.component';

@Component({
  selector: 'lib-expense-report',
  standalone: true,
  templateUrl: './expense-report.component.html',
  styleUrls: ['./expense-report.component.css'],
  imports: [
    CommonModule,
    ExpenseReportListComponent,
  ],
})
export class ExpenseReportComponent {}
