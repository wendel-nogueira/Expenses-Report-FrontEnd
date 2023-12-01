import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseAccountListComponent } from './expense-account-list/expense-account-list.component';

@Component({
  selector: 'lib-expense-account',
  standalone: true,
  templateUrl: './expense-account.component.html',
  styleUrls: ['./expense-account.component.css'],
  imports: [CommonModule, ExpenseAccountListComponent],
})
export class ExpenseAccountComponent {}
