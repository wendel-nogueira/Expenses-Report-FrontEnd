import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-data-rows',
  standalone: true,
  templateUrl: './data-rows.component.html',
  styleUrls: ['./data-rows.component.css'],
  imports: [CommonModule, MatCardModule],
})
export class DataRowsComponent implements OnInit {
  @Input() ariaLabel: string;
  @Input() tableColumns: rowColumns[];
  @Input() dataSource: unknown[];
  @Input() loading: boolean;

  rowColumnsNames: string[];

  constructor() {
    this.ariaLabel = '';
    this.tableColumns = [];
    this.dataSource = [];
    this.loading = true;

    this.rowColumnsNames = [];
  }

  ngOnInit(): void {
    this.rowColumnsNames = this.tableColumns.map((column) => column.name);
  }
}

export interface rowColumns {
  name: string;
  label: string;
}
