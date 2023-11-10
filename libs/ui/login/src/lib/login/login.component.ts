/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { ContentComponent } from 'libs/ui/page/content/content.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RecoveryPassComponent } from './recovery-pass/recovery-pass.component';

@Component({
  selector: 'lib-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    ContentComponent,
    LoginFormComponent,
    RecoveryPassComponent,
  ],
})
export class LoginComponent {
  hide = true;
  isResetPassword = false;
  isMobile = false;

  constructor() {
    this.onResize();
  }

  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }
}
