/* eslint-disable @nx/enforce-module-boundaries */
import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IdentityService } from '../../../../../../services/identity/identity.service';
import { Role } from '../../../../../../models/Role';
import { Identity } from '../../../../../../models/Identity';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { InputEmailComponent } from '../../../../../forms/input-email/input-email.component';
import {
  SelectComponent,
  SelectOption,
} from '../../../../../forms/select/select.component';
import { HeaderComponent } from '../../../../../page/header/header.component';
import { ContentComponent } from '../../../../../page/content/content.component';
import { FlatButtonComponent } from '../../../../../buttons/flat-button/flat-button.component';
import { RedirectButtonComponent } from '../../../../../buttons/redirect-button/redirect-button.component';
import { ButtonGroupComponent } from '../../../../../buttons/button-group/button-group.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { FormComponent } from 'libs/ui/forms/form/form.component';

@Component({
  selector: 'lib-user-new',
  standalone: true,
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    ContentComponent,
    InputEmailComponent,
    SelectComponent,
    MatSnackBarModule,
    FlatButtonComponent,
    RedirectButtonComponent,
    ButtonGroupComponent,
    FormGroupComponent,
    FormComponent,
  ],
})
export class UserNewComponent implements OnInit {
  email = '';
  emailExists = false;
  emailIsInvalid = true;

  allRoles: Role[] = [];
  roles: SelectOption[] = [];
  role = '';
  roleIsInvalid = true;

  isAccountant = false;

  constructor(
    private identityService: IdentityService,
    private authService: AuthService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const role = this.authService.getIdentity()?.role;

    this.isAccountant = role === 'Accountant';

    this.getRoles();
  }

  getRoles() {
    this.identityService.getRoles().subscribe((roles) => {
      const options: SelectOption[] = [];

      roles.forEach((role) => {
        options.push({
          value: role.enumId.toString(),
          viewValue: role.name,
        });
      });

      this.roles = options;
      this.allRoles = roles;

      if (!this.isAccountant) {
        const fieldStaffEnum = this.roles.find(
          (role) => role.viewValue === 'FieldStaff'
        )?.value as string;

        this.role = fieldStaffEnum;
        this.roleIsInvalid = false;
      }
    });
  }

  emailChangeValue(email: string) {
    this.email = email;
    this.emailExists = false;

    if (this.emailIsInvalid) return;

    this.identityService.checkEmailExists(email).subscribe((exists) => {
      if (exists) {
        this.emailExists = true;
      }
    });
  }

  emailIsInvalidChangeValue(isInvalid: boolean) {
    this.emailIsInvalid = isInvalid;
  }

  roleChangeValue(role: string) {
    this.role = role;
  }

  roleIsInvalidChangeValue(isInvalid: boolean) {
    this.roleIsInvalid = isInvalid;
  }

  onSubmit() {
    if (
      this.emailIsInvalid ||
      this.roleIsInvalid ||
      !this.email ||
      !this.role
    ) {
      this.matSnackBar.open(
        'Invalid fields! Check that the fields have been filled in correctly.',
        '',
        {
          duration: 4000,
          panelClass: ['red-snackbar'],
        }
      );

      return;
    }

    const roleEnumId = parseInt(this.role);

    this.identityService
      .createIdentity({
        email: this.email,
        role: roleEnumId,
      } as Identity)
      .subscribe(
        () => {
          this.matSnackBar.open('User created successfully!', '', {
            duration: 4000,
            panelClass: ['green-snackbar'],
          });

          this.router.navigate(['/users']);
        },
        () => {
          this.matSnackBar.open('Error creating user!', '', {
            duration: 4000,
            panelClass: ['red-snackbar'],
          });
        }
      );
  }
}
