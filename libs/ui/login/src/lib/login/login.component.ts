/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from 'libs/services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'libs/services/user/user.service';
import { TokenIdentity } from 'libs/models/TokenIdentity';

@Component({
  selector: 'lib-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    RouterModule,
    NgIf,
  ],
})
export class LoginComponent {
  hide = true;
  loadingLogin = false;
  loadingResetPassword = false;
  isResetPassword = false;
  isMobile = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
  ]);

  fields = [this.emailFormControl, this.passwordFormControl];

  matcher = new ErrorStateMatcher();

  onSubmit() {
    if (this.fields.some((field) => field.invalid)) return;

    const email = this.emailFormControl.value as string;
    const password = this.passwordFormControl.value as string;

    this.loadingLogin = true;

    this.authService.login(email, password).subscribe(
      (response) => {
        this.loadingLogin = false;

        if (!response.token) return;

        this.authService.createSession(response.token);

        const identity = this.authService.getIdentity() as TokenIdentity;

        this.userService.getUserByIdentityId(identity.nameid).subscribe(
          () => {
            if (this.authService.getSession()) {
              this.router.navigate(['/']);
            }
          },
          () => {
            if (this.authService.getSession()) {
              this.router.navigate(['/update-user']);
            }
          }
        );
      },
      () => {
        this.loadingLogin = false;
      }
    );
  }

  resetPasswordFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
  ]);

  onSubmitResetPassword() {
    if (this.resetPasswordFormControl.invalid) return;

    this.loadingResetPassword = true;

    const email = this.resetPasswordFormControl.value as string;

    this.authService.sendResetPasswordEmail(email).subscribe(
      () => {
        this.loadingResetPassword = false;
        this.isResetPassword = false;
      },
      () => {
        this.loadingLogin = false;
      }
    );
  }
}
