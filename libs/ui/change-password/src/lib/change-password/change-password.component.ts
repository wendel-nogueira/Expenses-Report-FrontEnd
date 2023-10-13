/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';

@Component({
  selector: 'lib-change-password',
  standalone: true,
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
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
  ],
})
export class ChangePasswordComponent implements OnInit {
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;
  token = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.token = params.get('token') as string;

      if (this.token === '') {
        this.router.navigate(['/login']);
      }
    });
  }

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(50),
  ]);
  confirmPasswordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(50),
  ]);

  fields = [this.passwordFormControl, this.confirmPasswordFormControl];

  matcher = new ErrorStateMatcher();

  onConfirmPasswordChange() {
    if (this.fields.some((field) => field.invalid)) return;

    const password = this.passwordFormControl.value;
    const confirmPassword = this.confirmPasswordFormControl.value;

    if (password !== confirmPassword) {
      this.confirmPasswordFormControl.setErrors({ mismatch: true });
    } else {
      this.confirmPasswordFormControl.setErrors(null);
    }
  }

  onSubmit() {
    if (this.token === '') return;

    if (this.loading) return;

    if (this.fields.some((field) => field.invalid)) return;

    const password = this.passwordFormControl.value as string;
    const confirmPassword = this.confirmPasswordFormControl.value as string;

    if (password !== confirmPassword) {
      this.confirmPasswordFormControl.setErrors({ mismatch: true });
      return;
    }

    this.loading = true;

    this.authService
      .changePassword(this.token, password, confirmPassword)
      .subscribe(
        () => {
          this.loading = false;
          this.router.navigate(['/login']);
        },
        () => {
          this.loading = false;
        }
      );
  }
}
