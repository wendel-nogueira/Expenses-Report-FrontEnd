/* eslint-disable @nx/enforce-module-boundaries */
import { OnChanges, SimpleChanges } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { AuthService } from 'libs/services/auth/auth.service';
import { Items, ListItemComponent } from './list-item/list-item.component';
import { IconComponent } from './icon/icon.component';

@Component({
  selector: 'lib-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    ListItemComponent,
    IconComponent,
  ],
})
export class HeaderComponent implements OnInit, OnChanges {
  @Input() isMobile = false;
  @Output() menuChange = new EventEmitter();

  collapsed = true;

  showUserMenu = false;
  showDepartamentMenu = false;
  showProjectMenu = false;

  subMenuOpened = '';

  userMenuItems: Items[] = [];
  departamentMenuItems: Items[] = [];
  projectMenuItems: Items[] = [];

  role = '';
  email = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.role = this.authService.getIdentity()?.role as string;
    this.email = this.authService.getIdentity()?.email as string;

    if (this.email.length > 21)
      this.email = this.email.substring(0, 21) + '...';

    this.showUserMenu = this.role === 'Accountant' || this.role === 'Manager';
    this.showDepartamentMenu =
      this.role === 'Accountant' || this.role === 'Manager';
    this.showProjectMenu = true;

    this.userMenuItems = [
      {
        text: 'new',
        link: '/users/new',
        show: this.role === 'Accountant',
      },
      {
        text: 'list',
        link: '/users',
        show: this.role === 'Accountant' || this.role === 'Manager',
      },
    ];

    this.departamentMenuItems = [
      {
        text: 'new',
        link: '/departaments/new',
        show: this.role === 'Accountant',
      },
      {
        text: 'list',
        link: '/departaments',
        show: this.role === 'Accountant' || this.role === 'Manager',
      },
    ];

    this.projectMenuItems = [
      {
        text: 'new',
        link: '/projects/new',
        show: true,
      },
      {
        text: 'list',
        link: '/projects',
        show: true,
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isMobile'] && changes['isMobile']['currentValue']) {
      this.collapsed = false;
    } else if (changes['isMobile'] && !changes['isMobile']['currentValue']) {
      this.collapsed = true;
    }
  }

  toggleCollapsed(): void {
    if (this.isMobile) return;
    this.collapsed = !this.collapsed;
  }

  toggleMenu(menu: string): void {
    if (!this.isMobile) {
      this.collapsed = false;
    }

    this.showUserMenu = menu === 'user' ? !this.showUserMenu : false;
    this.showDepartamentMenu =
      menu === 'departament' ? !this.showDepartamentMenu : false;
    this.showProjectMenu = menu === 'project' ? !this.showProjectMenu : false;
  }

  signOut(): void {
    this.authService.logout();
  }

  // onResize() {
  //   if (window.innerWidth < 1024) {
  //     this.collapsed = false;
  //     this.isMobile = true;
  //   }
  // }

  onClick(subMenu: string) {
    this.subMenuOpened = subMenu;
    if (subMenu != 'profile' && subMenu != 'home') this.collapsed = false;
  }

  closeMenu() {
    this.menuChange.emit();
    this.subMenuOpened = '';

    if (!this.isMobile) {
      this.collapsed = true;
    }
  }
}
