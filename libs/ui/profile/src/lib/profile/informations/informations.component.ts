/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../../../../../../services/user/user.service';
import { IdentityService } from '../../../../../../services/identity/identity.service';
import { Identity } from '../../../../../../models/Identity';
import { Name, Address, User } from '../../../../../../models/User';
import { AuthService } from './../../../../../../services/auth/auth.service';
import { ContentComponent } from 'libs/ui/page/content/content.component';
import { HeaderComponent } from 'libs/ui/page/header/header.component';
import { InputTextComponent } from 'libs/ui/forms/input-text/input-text.component';
import { FlatButtonComponent } from 'libs/ui/buttons/flat-button/flat-button.component';
import { RedirectButtonComponent } from 'libs/ui/buttons/redirect-button/redirect-button.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { ButtonGroupComponent } from 'libs/ui/buttons/button-group/button-group.component';
import { AddressGroupComponent } from 'libs/ui/forms/address-group/address-group.component';
import { FormComponent } from 'libs/ui/forms/form/form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'lib-informations',
  standalone: true,
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    ContentComponent,
    InputTextComponent,
    FlatButtonComponent,
    RedirectButtonComponent,
    FormGroupComponent,
    ButtonGroupComponent,
    AddressGroupComponent,
    FormComponent,
    MatSnackBarModule,
  ],
})
export class InformationsComponent implements OnInit {
  identity: Identity | null;
  user: User | null;
  loading = true;
  currentUrl = this.router.url;

  firstNameIsInvalid = false;
  lastNameIsInvalid = false;
  roleIsInvalid = false;
  zipIsInvalid = false;
  countryIsInvalid = false;
  stateIsInvalid = false;
  cityIsInvalid = false;
  addressIsInvalid = false;

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
    private identityService: IdentityService,
    private userService: UserService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    this.identity = null;
    this.user = null;
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    const identity = this.authService.getIdentity();

    if (!identity) return;

    const id = identity.nameid;

    this.identityService.getIdentityById(id).subscribe((identity) => {
      this.userService.getUserByIdentityId(id).subscribe((user) => {
        this.user = user;
        this.identity = identity;

        this.name.firstName = this.user?.name.firstName as string;
        this.name.lastName = this.user?.name.lastName as string;

        this.address.zip = this.user?.address.zip as string;
        this.address.country = this.user?.address.country as string;
        this.address.state = this.user?.address.state as string;
        this.address.city = this.user?.address.city as string;
        this.address.address = this.user?.address.address as string;

        this.loading = false;
      });
    });
  }

  onSubmit() {
    const fieldsAreInvalid =
      this.firstNameIsInvalid ||
      this.lastNameIsInvalid ||
      this.roleIsInvalid ||
      this.zipIsInvalid ||
      this.countryIsInvalid ||
      this.stateIsInvalid ||
      this.cityIsInvalid ||
      this.addressIsInvalid;

    if (!this.user || fieldsAreInvalid) {
      this.matSnackBar.open('Invalid fields! Check that the fields have been filled in correctly.', '', {
        duration: 4000,
        panelClass: ['red-snackbar'],
      });

      return;
    };

    const nameHasBeenUpdated =
      this.user?.name.firstName !== this.name.firstName ||
      this.user?.name.lastName !== this.name.lastName;
    const addressHasBeenUpdated =
      this.user?.address.zip !== this.address.zip ||
      this.user?.address.country !== this.address.country ||
      this.user?.address.state !== this.address.state ||
      this.user?.address.city !== this.address.city ||
      this.user?.address.address !== this.address.address;

    const userToUpdate: User = {
      id: this.user?.id,
      identityId: this.identity?.id as string,
      name: {
        firstName: this.name.firstName,
        lastName: this.name.lastName,
      },
      address: {
        zip: this.address.zip,
        country: this.address.country,
        state: this.address.state,
        city: this.address.city,
        address: this.address.address,
      },
    };

    if ((nameHasBeenUpdated || addressHasBeenUpdated) && userToUpdate) {
      this.userService
        .updateUser(this.user?.id as string, userToUpdate)
        .subscribe(
          () => {
            this.matSnackBar.open('Updated successfully!', '', {
              duration: 4000,
              panelClass: ['green-snackbar'],
            });

            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate([this.currentUrl]);
              });
          },
          () => {
            this.matSnackBar.open('Error while updating!', '', {
              duration: 4000,
              panelClass: ['red-snackbar'],
            });
          }
        );
    }
  }
}
