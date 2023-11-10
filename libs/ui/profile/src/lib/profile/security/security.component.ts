/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'libs/services/auth/auth.service';
import { IdentityService } from 'libs/services/identity/identity.service';
import { RouterModule } from '@angular/router';
import { InputEmailComponent } from 'libs/ui/forms/input-email/input-email.component';
import { FlatButtonComponent } from 'libs/ui/buttons/flat-button/flat-button.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { ButtonGroupComponent } from 'libs/ui/buttons/button-group/button-group.component';
import { FormComponent } from 'libs/ui/forms/form/form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'lib-security',
  standalone: true,
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    InputEmailComponent,
    FlatButtonComponent,
    FormGroupComponent,
    ButtonGroupComponent,
    FormComponent,
    MatSnackBarModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
})
export class SecurityComponent implements OnInit {
  id = '';

  isChangeEmail = false;
  loading = false;

  emailExists = false;
  newEmail = '';
  newEmailIsInvalid = false;
  confirmNewEmail = '';
  confirmNewEmailIsInvalid = false;

  constructor(
    private authService: AuthService,
    private identityService: IdentityService,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const identity = this.authService.getIdentity();

    if (!identity) return;

    this.id = identity.nameid;
  }

  emailChangeValue(value: string) {
    if (this.newEmailIsInvalid) return;

    this.newEmail = value;

    this.identityService.checkEmailExists(this.newEmail).subscribe((exists) => {
      if (exists && exists.id !== this.id) {
        this.emailExists = true;
        this.newEmailIsInvalid = true;
      }
    });
  }

  confirmEmailChangeValue(value: string) {
    if (this.confirmNewEmailIsInvalid) return;

    this.confirmNewEmail = value;

    if (this.newEmail !== this.confirmNewEmail) {
      this.confirmNewEmailIsInvalid = true;
    }
  }

  onSubmitChangeEmail(event: Event) {
    event.preventDefault();

    if (this.newEmailIsInvalid || this.confirmNewEmailIsInvalid) {
      this.matSnackBar.open('Invalid fields! Check that the fields have been filled in correctly.', '', {
        duration: 4000,
        panelClass: ['red-snackbar'],
      });

      return;
    };

    this.loading = true;

    this.authService.changeEmail(this.newEmail).subscribe(
      () => {
        this.loading = false;

        this.matSnackBar.open('Updated successfully!', '', {
          duration: 4000,
          panelClass: ['green-snackbar'],
        });

        this.authService.logout();
      },
      () => {
        this.loading = false;

        this.matSnackBar.open('Error while updating!', '', {
          duration: 4000,
          panelClass: ['red-snackbar'],
        });
      }
    );
  }

  sendResetPasswordEmail() {
    const identity = this.authService.getIdentity();

    if (!identity) return;

    this.authService.sendResetPasswordEmail(identity.email).subscribe();
  }
}
