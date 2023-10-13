/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
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
export class HeaderComponent {
  collapsed = true;

  constructor(
    private authService: AuthService,
  ) {}

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  signOut(): void {
    this.authService.logout();
  }
}
