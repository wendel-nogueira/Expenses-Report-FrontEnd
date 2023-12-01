/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from 'header';
import { FooterComponent } from 'footer';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-master-page',
  standalone: true,
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    MatSidenavModule,
    MatIconModule,
  ],
})
export class MasterPageComponent {
  menuOpened = false;
  isMobile = false;
  size = 0;

  constructor() {
    this.onResize();
  }

  onResize() {
    this.isMobile = window.innerWidth < 1024;
    this.menuOpened = !this.isMobile;
  }
}
