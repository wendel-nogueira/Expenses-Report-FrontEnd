import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-expense-new',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-new.component.html',
  styleUrls: ['./expense-new.component.css'],
})
export class ExpenseNewComponent {}
