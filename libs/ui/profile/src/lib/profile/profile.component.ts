import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SecurityComponent } from './security/security.component';
import { InformationsComponent } from './informations/informations.component';

@Component({
  selector: 'lib-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    InformationsComponent,
    SecurityComponent,
  ],
})
export class ProfileComponent {
  isMobile = false;
  tabs = ['informations', 'security'];
  selected = this.tabs[0];
  sidenavMode: MatDrawerMode = !this.isMobile ? 'side' : 'over';

  constructor() {
    this.onResize();
  }

  onResize() {
    this.isMobile = window.innerWidth <= 768;

    if (this.isMobile) {
      this.sidenavMode = 'over';
    } else {
      this.sidenavMode = 'side';
    }
  }
}
