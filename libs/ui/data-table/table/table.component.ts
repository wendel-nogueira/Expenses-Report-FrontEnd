/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class TableComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() ariaLabel: string;
  @Input() tableColumns: tableColumns[];
  @Input() dataSource: MatTableDataSource<any>;
  @Input() loading: boolean;

  tableColumnsNames: string[];
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  windowSize = window.innerWidth;

  constructor() {
    this.ariaLabel = '';
    this.tableColumns = [];
    this.dataSource = new MatTableDataSource<any>();
    this.loading = true;

    this.tableColumnsNames = [];
  }

  ngOnInit(): void {
    this.tableColumnsNames = this.tableColumns.map((column) => column.name);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      this.dataSource.paginator = this.paginator;
    }
  }

  onResize(): void {
    this.windowSize = window.innerWidth;
  }
}

export interface tableColumns {
  name: string;
  label: string;
}
