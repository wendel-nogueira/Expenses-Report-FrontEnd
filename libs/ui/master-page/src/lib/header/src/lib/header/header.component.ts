/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { AuthService } from 'libs/services/auth/auth.service';

@Component({
  selector: 'lib-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    RouterModule,
  ],
})
export class HeaderComponent implements OnInit {
  collapsed = true;

  showUserMenu = false;
  showDepartamentMenu = false;
  showProjectMenu = false;

  isAccountant = false;
  isManager = false;
  isFieldStaff = false;

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const role = this.authService.getIdentity()?.role;

    this.isAccountant = role === 'Accountant';
    this.isManager = role === 'Manager';
    this.isFieldStaff = role === 'FieldStaff';
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  toggleMenu(menu: string): void {
    this.collapsed = false;

    this.showUserMenu = menu === 'user' ? !this.showUserMenu : false;
    this.showDepartamentMenu = menu === 'departament' ? !this.showDepartamentMenu : false;
    this.showProjectMenu = menu === 'project' ? !this.showProjectMenu : false;
  }

  signOut(): void {
    this.authService.logout();
  }
}
