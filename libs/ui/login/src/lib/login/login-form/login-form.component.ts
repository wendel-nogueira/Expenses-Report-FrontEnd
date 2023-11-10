/* eslint-disable @nx/enforce-module-boundaries */
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputEmailComponent } from 'libs/ui/forms/input-email/input-email.component';
import { InputPasswordComponent } from 'libs/ui/forms/input-password/input-password.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { FormComponent } from 'libs/ui/forms/form/form.component';
import { FlatButtonComponent } from 'libs/ui/buttons/flat-button/flat-button.component';
import { ButtonGroupComponent } from 'libs/ui/buttons/button-group/button-group.component';
import { AuthService } from 'libs/services/auth/auth.service';
import { UserService } from 'libs/services/user/user.service';
import { Router } from '@angular/router';
import { TokenIdentity } from 'libs/models/TokenIdentity';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SubheaderComponent } from 'libs/ui/page/subheader/subheader.component';


@Component({
  selector: 'lib-login-form',
  standalone: true,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  imports: [
    CommonModule,
    FormComponent,
    FormGroupComponent,
    InputEmailComponent,
    InputPasswordComponent,
    FlatButtonComponent,
    ButtonGroupComponent,
    MatSnackBarModule,
    SubheaderComponent
  ],
})
export class LoginFormComponent {
  @Output() resetPasswordIsClicked = new EventEmitter();

  email = '';
  emailIsInvalid = true;
  password = '';
  passwordIsInvalid = true;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {}

  onClickResetPassword() {
    this.resetPasswordIsClicked.emit();
  }

  onSubmit() {
    if (this.emailIsInvalid || this.passwordIsInvalid) return;

    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        if (!response.token) return;

        this.authService.createSession(response.token);

        const identity = this.authService.getIdentity() as TokenIdentity;

        this.userService.getUserByIdentityId(identity.nameid).subscribe(
          () => {
            if (this.authService.getSession()) {
              this.matSnackBar.open('Successfully logged in!', '', {
                duration: 4000,
                panelClass: ['green-snackbar'],
              });

              this.router.navigate(['/']);
            }
          },
          () => {
            if (this.authService.getSession()) {
              this.matSnackBar.open(
                'Successfully logged in! You need to update your user information.',
                '',
                {
                  duration: 4000,
                  panelClass: ['green-snackbar'],
                }
              );

              this.router.navigate(['/update-user']);
            }
          }
        );

        this.isLoading = false;
      },
      (error) => {
        let message = 'Error logging in!';

        if (error.code === 400) {
          message = 'Invalid email or password!';
        } else if (error.code === 500) {
          message = 'An error occurred on the server!';
        }

        this.matSnackBar.open(message, '', {
          duration: 4000,
          panelClass: ['red-snackbar'],
        });

        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
