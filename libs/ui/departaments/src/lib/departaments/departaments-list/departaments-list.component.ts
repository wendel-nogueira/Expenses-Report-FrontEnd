import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {
  TableComponent,
  tableColumns,
} from '../../../../../data-table/table/table.component';
import { InputSearchComponent } from '../../../../../forms/input-search/input-search.component';
import { DepartamentService } from './../../../../../../services/departament/departament.service';


@Component({
  selector: 'lib-departaments-list',
  standalone: true,
  templateUrl: './departaments-list.component.html',
  styleUrls: ['./departaments-list.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    RouterModule,
    InputSearchComponent,
    TableComponent,
  ],
})
export class DepartamentsListComponent implements OnInit {
  searchValue: string;
  rows: rows[] = [];
  rowsFiltered: rows[] = [];
  columns: tableColumns[] = [
    { name: 'name', label: 'Name' },
    { name: 'acronym', label: 'Acronym' },
    { name: 'active', label: 'Active' },
    { name: 'actions', label: 'Actions' },
  ];
  loading = true;

  data: MatTableDataSource<rows>;

  constructor(
    private departamentService: DepartamentService,
  ) {
    this.searchValue = '';

    this.data = new MatTableDataSource<rows>(this.rows);
  }

  ngOnInit(): void {
    this.getDepartaments();
  }

  getDepartaments() {
    this.loading = true;

    this.departamentService.getDepartaments().subscribe((data) => {
      this.rows = [];
      this.rowsFiltered = [];

      data.forEach((departament) => {
        this.rows.push({
          id: departament.id,
          name: departament.name,
          acronym: departament.acronym,
          active: departament.isDeleted ? 'No' : 'Yes',
          actions: {
            href: `/departaments/edit/${departament.id}`,
            icon: 'edit',
            style: 'bg-blue-400 hover:bg-blue-500',
          },
        });
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
        row.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        row.active.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    });

    if (this.searchValue === '')
      this.data = new MatTableDataSource<rows>(this.rows);
    else this.data = new MatTableDataSource<rows>(this.rowsFiltered);

    this.loading = false;
  }
}

interface rows {
  id?: string;
  name: string;
  acronym: string;
  active: string;
  actions: {
    href: string;
    icon: string;
    style: string;
  };
}
