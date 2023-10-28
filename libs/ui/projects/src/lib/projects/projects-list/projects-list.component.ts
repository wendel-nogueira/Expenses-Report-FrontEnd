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
import { ProjectService } from './../../../../../../services/project/project.service';
import { DepartamentService } from './../../../../../../services/departament/departament.service';
import { AuthService } from '../../../../../../services/auth/auth.service';

@Component({
  selector: 'lib-projects-list',
  standalone: true,
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css'],
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
export class ProjectsListComponent implements OnInit {
  searchValue: string;
  rows: rows[] = [];
  rowsFiltered: rows[] = [];
  columns: tableColumns[] = [
    { name: 'name', label: 'Name' },
    { name: 'code', label: 'Code' },
    { name: 'departament', label: 'Departament' },
    { name: 'active', label: 'Active' },
    { name: 'actions', label: 'Actions' },
  ];
  loading = true;

  data: MatTableDataSource<rows>;

  isAccountant = false;

  constructor(
    private projectService: ProjectService,
    private departamentService: DepartamentService,
    private authService: AuthService
  ) {
    this.searchValue = '';

    this.data = new MatTableDataSource<rows>(this.rows);
  }

  ngOnInit(): void {
    const role = this.authService.getIdentity()?.role;

    this.isAccountant = role === 'Accountant';

    if (!this.isAccountant) this.columns.pop();

    this.getProjects();
  }

  getProjects() {
    this.loading = true;

    this.projectService.getProjects().subscribe((data) => {
      this.rows = [];

      this.departamentService.getDepartaments().subscribe((dataDepartament) => {
        data.forEach((element) => {
          this.rows.push({
            id: element.id,
            name: element.name,
            code: element.code,
            departament:
              dataDepartament.find(
                (departament) => departament.id === element.departamentId
              )?.name || 'Not found',
            active: element.isDeleted ? 'No' : 'Yes',
            actions: {
              href: `/projects/edit/${element.id}`,
              icon: 'edit',
              style: 'bg-blue-400 hover:bg-blue-500',
            },
          });
        });

        this.data = new MatTableDataSource<rows>(this.rows);
        this.loading = false;
      });
    });
  }

  onChangeValue(value: string) {
    this.searchValue = value;
    this.loading = true;

    this.rowsFiltered = this.rows.filter((row) => {
      return (
        row.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        row.code.toLowerCase().includes(this.searchValue.toLowerCase()) ||
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
  code: string;
  departament: string;
  active: string;
  actions?: {
    href: string;
    icon: string;
    style: string;
  };
}
