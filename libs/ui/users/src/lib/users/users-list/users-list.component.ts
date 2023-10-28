/* eslint-disable @nx/enforce-module-boundaries */
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
import { Identity } from '../../../../../../models/Identity';
import { IdentityService } from '../../../../../../services/identity/identity.service';
import { UserService } from '../../../../../../services/user/user.service';
import { AuthService } from '../../../../../../services/auth/auth.service';

@Component({
  selector: 'lib-users-list',
  standalone: true,
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
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
export class UsersListComponent implements OnInit {
  searchValue: string;
  rows: rows[] = [];
  rowsFiltered: rows[] = [];
  columns: tableColumns[] = [
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' },
    { name: 'email', label: 'Email' },
    { name: 'roleName', label: 'Role' },
    { name: 'active', label: 'Active' },
    { name: 'actions', label: 'Actions' },
  ];
  loadingIdentities = true;
  loadingUsers = true;
  loading = true;

  data: MatTableDataSource<rows>;

  isAccountant = false;
  isManager = false;

  constructor(
    private identityService: IdentityService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.searchValue = '';

    this.data = new MatTableDataSource<rows>(this.rows);
  }

  ngOnInit(): void {
    const role = this.authService.getIdentity()?.role;

    this.isAccountant = role === 'Accountant';
    this.isManager = role === 'Manager';

    if (!this.isAccountant && !this.isManager) this.columns.pop();

    this.getIdentities();
  }

  getIdentities() {
    const userIdentity = this.authService.getIdentity()?.nameid;

    this.identityService.getIdentities().subscribe((identities: Identity[]) => {
      this.rows = [];
      this.rowsFiltered = [];

      this.userService.getUsers().subscribe((users) => {
        identities.forEach((identity) => {
          if (identity.id === userIdentity) return;

          users.forEach((user) => {
            if (user.identityId === identity.id) {
              const data: rows = {
                id: identity.id,
                firstName: user.name.firstName,
                lastName: user.name.lastName,
                email: identity.email,
                roleName: identity.roleName,
                active: identity.isDeleted ? 'No' : 'Yes',
                actions: {
                  href: `/users/edit/${identity.id}`,
                  icon: 'edit',
                  style: 'bg-blue-400 hover:bg-blue-500',
                },
              };

              this.rows.push(data);
              this.rowsFiltered.push(data);
            }
          });
        });

        this.data = new MatTableDataSource<rows>(this.rows);
        this.loadingUsers = false;
      });

      this.loadingIdentities = false;
    });

    this.loading = false;
  }

  onChangeValue(value: string) {
    this.searchValue = value;
    this.loading = true;

    this.rowsFiltered = this.rows.filter((row) => {
      return (
        row.firstName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        row.lastName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        row.email.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        row.roleName.toLowerCase().includes(this.searchValue.toLowerCase())
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
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  active: string;
  actions: {
    href: string;
    icon: string;
    style: string;
  };
}
