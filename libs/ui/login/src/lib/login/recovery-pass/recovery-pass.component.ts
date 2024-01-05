/* eslint-disable @nx/enforce-module-boundaries */
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'libs/services/auth/auth.service';
import { FormComponent } from 'libs/ui/forms/form/form.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { InputEmailComponent } from 'libs/ui/forms/input-email/input-email.component';
import { FlatButtonComponent } from 'libs/ui/buttons/flat-button/flat-button.component';
import { ButtonGroupComponent } from 'libs/ui/buttons/button-group/button-group.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SubheaderComponent } from 'libs/ui/page/subheader/subheader.component';


@Component({
  selector: 'lib-recovery-pass',
  standalone: true,
  templateUrl: './recovery-pass.component.html',
  styleUrls: ['./recovery-pass.component.css'],
  imports: [
    CommonModule,
    FormComponent,
    FormGroupComponent,
    InputEmailComponent,
    FlatButtonComponent,
    ButtonGroupComponent,
    MatSnackBarModule,
    SubheaderComponent
  ],
})
export class RecoveryPassComponent {
  @Output() cancelIsClicked = new EventEmitter();

  resetPasswordEmail = '';
  resetPasswordEmailIsInvalid = true;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private matSnackBar: MatSnackBar
  ) {}

  onSubmit() {
    if (this.resetPasswordEmailIsInvalid) return;

    this.isLoading = true;

    this.authService.sendResetPasswordEmail(this.resetPasswordEmail).subscribe(
      () => {
        this.matSnackBar.open('Email successfully sent!', '', {
          duration: 4000,
          panelClass: ['green-snackbar'],
        });
      },
      () => {
        this.matSnackBar.open('Error sending email!', '', {
          duration: 4000,
          panelClass: ['red-snackbar'],
        });
        this.isLoading = false;
        this.resetPasswordEmail = '';
        this.resetPasswordEmailIsInvalid = true;
        this.cancelIsClicked.emit();
      },
      () => {
        this.isLoading = false;
        this.resetPasswordEmail = '';
        this.resetPasswordEmailIsInvalid = true;
        this.cancelIsClicked.emit();
      }
    );
  }

  onClickCancel() {
    this.cancelIsClicked.emit();
  }
}
