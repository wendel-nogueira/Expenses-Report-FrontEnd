/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'libs/services/auth/auth.service';
import { UserService } from 'libs/services/user/user.service';
import { IdentityService } from 'libs/services/identity/identity.service';
import { TokenIdentity } from 'libs/models/TokenIdentity';
import { Identity } from 'libs/models/Identity';
import { Address, Name, User } from 'libs/models/User';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { SubheaderComponent } from 'libs/ui/page/subheader/subheader.component';
import { ContentComponent } from 'libs/ui/page/content/content.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { FormComponent } from 'libs/ui/forms/form/form.component';
import { ButtonGroupComponent } from 'libs/ui/buttons/button-group/button-group.component';
import { FlatButtonComponent } from 'libs/ui/buttons/flat-button/flat-button.component';
import { AddressGroupComponent } from 'libs/ui/forms/address-group/address-group.component';
import { InputTextComponent } from 'libs/ui/forms/input-text/input-text.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'lib-update-user',
  standalone: true,
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
  imports: [
    CommonModule,
    MatStepperModule,
    SubheaderComponent,
    ContentComponent,
    FormComponent,
    FormGroupComponent,
    ButtonGroupComponent,
    FlatButtonComponent,
    AddressGroupComponent,
    InputTextComponent,
    MatSnackBarModule,
  ],
})
export class UpdateUserComponent implements OnInit {
  tokenIdentity: TokenIdentity | void = undefined;
  identity: Identity | null;
  loading = true;

  firstNameIsInvalid = true;
  lastNameIsInvalid = true;
  zipIsInvalid = true;
  countryIsInvalid = true;
  stateIsInvalid = true;
  cityIsInvalid = true;
  addressIsInvalid = true;

  name: Name = {
    firstName: '',
    lastName: '',
  };
  address: Address = {
    zip: '',
    country: '',
    state: '',
    city: '',
    address: '',
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private identityService: IdentityService,
    private matSnackBar: MatSnackBar
  ) {
    this.identity = null;
  }

  ngOnInit(): void {
    this.tokenIdentity = this.authService.getIdentity() as TokenIdentity;

    if (!this.tokenIdentity) this.authService.logout();

    this.identityService
      .getIdentityById(this.tokenIdentity.nameid)
      .subscribe((identity) => {
        this.identity = identity;

        this.userService.getUserByIdentityId(identity.id).subscribe(() => {
          this.authService.logout();
        });
      });
  }

  next(event: MatStepper) {
    if (this.firstNameIsInvalid || this.lastNameIsInvalid) return;

    event.next();
  }

  onSubmit(): void {
    if (!this.checkFields()) return;

    const user: User = {
      identityId: this.identity?.id as string,
      name: this.name,
      address: this.address,
    };

    this.userService.createUser(user).subscribe(
      () => {
        this.matSnackBar.open('Information updated successfully!', '', {
          duration: 4000,
          panelClass: ['green-snackbar'],
        });

        this.authService.logout();
      },
      () => {
        this.matSnackBar.open('Error updating information!', '', {
          duration: 4000,
          panelClass: ['red-snackbar'],
        });
      }
    );
  }

  checkFields(): boolean {
    if (
      this.firstNameIsInvalid ||
      this.lastNameIsInvalid ||
      this.zipIsInvalid ||
      this.countryIsInvalid ||
      this.stateIsInvalid ||
      this.cityIsInvalid ||
      this.addressIsInvalid ||
      !this.identity ||
      !this.tokenIdentity
    ) {
      return false;
    }

    return true;
  }
}
