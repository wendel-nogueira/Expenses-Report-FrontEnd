/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from 'libs/services/auth/auth.service';
import { IdentityService } from 'libs/services/identity/identity.service';

@Component({
  selector: 'lib-security',
  standalone: true,
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css'],
  imports: [
    CommonModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
})
export class SecurityComponent {
  isChangeEmail = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private identityService: IdentityService
  ) {}

  changeEmailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
  ]);

  confirmChangeEmailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
  ]);

  fields = [this.changeEmailFormControl, this.confirmChangeEmailFormControl];

  matcher = new ErrorStateMatcher();

  onChangeEmailChange() {
    if (this.changeEmailFormControl.invalid) return;

    const email = this.changeEmailFormControl.value as string;

    this.identityService.checkEmailExists(email).subscribe((exists) => {
      if (exists) {
        this.changeEmailFormControl.setErrors({ invalid: true });
      }
    });
  }

  onConfirmChangeEmailChange() {
    if (this.confirmChangeEmailFormControl.invalid) return;

    const email = this.changeEmailFormControl.value as string;
    const confirmEmail = this.confirmChangeEmailFormControl.value as string;

    if (email !== confirmEmail) {
      this.confirmChangeEmailFormControl.setErrors({ invalid: true });
    }
  }

  onSubmitChangeEmail() {
    if (this.fields.some((field) => field.invalid)) return;

    const email = this.changeEmailFormControl.value as string;
    const confirmEmail = this.confirmChangeEmailFormControl.value as string;

    if (email !== confirmEmail) {
      this.confirmChangeEmailFormControl.setErrors({ invalid: true });
      return;
    }

    this.loading = true;

    this.authService.changeEmail(email).subscribe(
      () => {
        this.loading = false;
        this.authService.logout();
      },
      () => {
        this.loading = false;
      }
    );
  }

  sendResetPasswordEmail() {
    const identity = this.authService.getIdentity();

    if (!identity) return;

    this.authService.sendResetPasswordEmail(identity.email).subscribe();
  }
}
