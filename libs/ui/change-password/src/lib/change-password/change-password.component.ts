/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'libs/services/auth/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ContentComponent } from 'libs/ui/page/content/content.component';
import { SubheaderComponent } from 'libs/ui/page/subheader/subheader.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ButtonGroupComponent } from 'libs/ui/buttons/button-group/button-group.component';
import { FlatButtonComponent } from 'libs/ui/buttons/flat-button/flat-button.component';
import { InputPasswordComponent } from 'libs/ui/forms/input-password/input-password.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { FormComponent } from 'libs/ui/forms/form/form.component';

@Component({
  selector: 'lib-change-password',
  standalone: true,
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  imports: [
    CommonModule,
    ContentComponent,
    SubheaderComponent,
    FormComponent,
    FormGroupComponent,
    InputPasswordComponent,
    FlatButtonComponent,
    ButtonGroupComponent,
    MatSnackBarModule,
    SubheaderComponent,
  ],
})
export class ChangePasswordComponent implements OnInit {
  loading = false;
  token = '';

  newPassword = '';
  newPasswordIsInvalid = true;
  confirmNewPassword = '';
  confirmNewPasswordIsInvalid = true;

  isLoading = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.token = params.get('token') as string;

      if (this.token === '') {
        this.router.navigate(['/login']);
      }
    });
  }

  confirmNewPasswordChangeValue(value: string) {
    this.confirmNewPassword = value;

    if (this.newPassword !== this.confirmNewPassword)
      this.confirmNewPasswordIsInvalid = true;
  }

  onSubmit() {
    if (this.newPasswordIsInvalid || this.confirmNewPasswordIsInvalid) {
      this.matSnackBar.open('Please fill in all fields correctly', '', {
        duration: 4000,
        panelClass: ['red-snackbar'],
      });

      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.matSnackBar.open('Passwords do not match', '', {
        duration: 4000,
        panelClass: ['red-snackbar'],
      });

      return;
    }

    if (this.token === '') return;

    this.loading = true;

    this.authService
      .changePassword(this.token, this.newPassword, this.confirmNewPassword)
      .subscribe(
        () => {
          this.loading = false;

          this.matSnackBar.open('Successfully changed password!', '', {
            duration: 4000,
            panelClass: ['green-snackbar'],
          });

          this.router.navigate(['/login']);
        },
        (error) => {
          let message = 'Error changing password!';

          if (error.code === 404) {
            message = 'Invalid token!';
          } else if (error.code === 500) {
            message = 'An error occurred on the server!';
          }

          this.matSnackBar.open(message, '', {
            duration: 4000,
            panelClass: ['red-snackbar'],
          });

          this.isLoading = false;
        }
      );
  }
}
