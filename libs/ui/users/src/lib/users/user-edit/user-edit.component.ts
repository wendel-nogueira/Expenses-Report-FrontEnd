/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../../../../../../services/user/user.service';
import { IdentityService } from '../../../../../../services/identity/identity.service';
import { Identity } from '../../../../../../models/Identity';
import { Name, Address, User } from '../../../../../../models/User';
import { Role } from '../../../../../../models/Role';
import { AuthService } from './../../../../../../services/auth/auth.service';
import { ContentComponent } from 'libs/ui/page/content/content.component';
import { HeaderComponent } from 'libs/ui/page/header/header.component';
import { InputEmailComponent } from 'libs/ui/forms/input-email/input-email.component';
import { InputTextComponent } from 'libs/ui/forms/input-text/input-text.component';
import {
  SelectComponent,
  SelectOption as SelectOption,
} from 'libs/ui/forms/select/select.component';
import {
  SelectMultipleComponent,
  SelectMultipleOption,
} from 'libs/ui/forms/select-multiple/select-multiple.component';
import { FlatButtonComponent } from 'libs/ui/buttons/flat-button/flat-button.component';
import { RedirectButtonComponent } from 'libs/ui/buttons/redirect-button/redirect-button.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { ButtonGroupComponent } from 'libs/ui/buttons/button-group/button-group.component';
import { AddressGroupComponent } from 'libs/ui/forms/address-group/address-group.component';
import { FormComponent } from 'libs/ui/forms/form/form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'lib-user-edit',
  standalone: true,
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    ContentComponent,
    InputEmailComponent,
    SelectComponent,
    SelectMultipleComponent,
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
export class UserEditComponent implements OnInit {
  id: string | null = null;

  user: User | null;
  identity: Identity | null;
  userSupervisors: string[] = [];

  allUsers: User[] = [];
  allManagers: User[] = [];
  managers: SelectMultipleOption[] = [];
  loading = true;
  currentUrl = this.router.url;

  allRoles: Role[] = [];
  roles: SelectOption[] = [];

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
  email = '';
  role = '';
  address: Address = {
    zip: '',
    country: '',
    state: '',
    city: '',
    address: '',
  };

  userHasBeenUpdated = false;
  roleHasBeenUpdated = false;

  isAccountant = false;
  showSuperviseButton = false;

  constructor(
    private route: ActivatedRoute,
    private identityService: IdentityService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    this.user = null;
    this.identity = null;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });

    const role = this.authService.getIdentity()?.role;

    this.isAccountant = role === 'Accountant';

    this.getRoles();
    this.getUser();
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
    });
  }

  getUser() {
    if (this.id === null) {
      this.loading = false;
      return;
    }

    this.identityService.getIdentityById(this.id).subscribe((identity) => {
      this.userService.getUserByIdentityId(identity.id).subscribe((user) => {
        this.user = user;
        this.identity = identity;

        this.name = {
          firstName: this.user?.name.firstName,
          lastName: this.user?.name.lastName,
        };
        this.email = this.identity?.email as string;
        this.role = this.roles.find(
          (role) => role.viewValue === this.identity?.roleName
        )?.value as string;
        this.address = {
          zip: this.user?.address.zip,
          country: this.user?.address.country,
          state: this.user?.address.state,
          city: this.user?.address.city,
          address: this.user?.address.address,
        };

        this.getAllUsers();
      });
    });
  }

  getAllUsers() {
    this.userService.getUsers().subscribe(
      (users) => {
        this.allUsers = users.filter((user) => user.id !== this.user?.id);

        this.getUserSupervisors();
        this.getAllManagers();
      },
      () => {
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  getUserSupervisors() {
    this.userService
      .getSupervisors(this.user?.id as string)
      .subscribe((supervisors) => {
        this.userSupervisors = supervisors.map(
          (supervisor) => supervisor.id as string
        );

        if (!this.isAccountant) {
          const userIdentity = this.authService.getIdentity()?.nameid as string;

          this.userService
            .getUserByIdentityId(userIdentity)
            .subscribe((user) => {
              const supervisor = this.userSupervisors.find(
                (supervisor) => supervisor === user?.id
              );

              if (!supervisor) {
                this.showSuperviseButton = true;
              }
            });
        }
      });
  }

  getAllManagers() {
    this.identityService.getIdentities().subscribe((identities) => {
      const managers = identities.filter(
        (identity) => identity.roleName === 'Manager'
      );

      const allManagers: SelectMultipleOption[] = [];

      managers.forEach((manager) => {
        const user = this.allUsers.find(
          (user) => user.identityId === manager.id
        );

        if (user) {
          allManagers.push({
            value: user.id as string,
            viewValue: `${user.name.firstName} ${user.name.lastName}`,
          });
        }
      });

      this.managers = allManagers;
    });
  }

  onSubmit() {
    if (this.id === null) return;

    const fieldsAreInvalid =
      this.firstNameIsInvalid ||
      this.lastNameIsInvalid ||
      this.roleIsInvalid ||
      this.zipIsInvalid ||
      this.countryIsInvalid ||
      this.stateIsInvalid ||
      this.cityIsInvalid ||
      this.addressIsInvalid;

    if (this.id === null || fieldsAreInvalid) {
      this.matSnackBar.open('Invalid fields! Check that the fields have been filled in correctly.', '', {
        duration: 4000,
        panelClass: ['red-snackbar'],
      });

      return;
    }

    const identityRole = this.allRoles.find(
      (role) => role.name === this.identity?.roleName
    )?.enumId as number;

    const roleUpdated = parseInt(this.role);
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

    if (identityRole !== roleUpdated) {
      this.identityService.updateIdentityRole(this.id, roleUpdated).subscribe(
        () => {
          this.roleHasBeenUpdated = true;
          this.matSnackBar.open('User updated successfully!', '', {
            duration: 4000,
            panelClass: ['green-snackbar'],
          });

          this.reloadPage();
        },
        () => {
          this.matSnackBar.open('Error updating user!', '', {
            duration: 4000,
            panelClass: ['red-snackbar'],
          });
        }
      );
    } else {
      this.roleHasBeenUpdated = true;
    }

    if ((nameHasBeenUpdated || addressHasBeenUpdated) && userToUpdate) {
      this.userService
        .updateUser(this.user?.id as string, userToUpdate)
        .subscribe(
          () => {
            this.userHasBeenUpdated = true;
            this.matSnackBar.open('User updated successfully!', '', {
              duration: 4000,
              panelClass: ['green-snackbar'],
            });

            this.reloadPage();
          },
          () => {
            this.matSnackBar.open('Error updating user!', '', {
              duration: 4000,
              panelClass: ['red-snackbar'],
            });
          }
        );
    } else {
      this.userHasBeenUpdated = true;
    }
  }

  onActivate(event: Event) {
    event.preventDefault();

    if (this.id === null) return;

    this.identityService.activateIdentity(this.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    });
  }

  onDeactivate(event: Event) {
    event.preventDefault();

    if (this.id === null) return;

    this.identityService.deactivateIdentity(this.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    });
  }

  changeSupervisorsValue(supervisorsToUpdate: string[]) {
    const supervisorsToAdd = supervisorsToUpdate.filter(
      (supervisor) => !this.userSupervisors.includes(supervisor)
    );

    const supervisorsToRemove = this.userSupervisors.filter(
      (supervisor) => !supervisorsToUpdate.includes(supervisor)
    );

    if (supervisorsToAdd[0] !== undefined) {
      this.userService
        .addSupervisor(this.user?.id as string, supervisorsToAdd[0] as string)
        .subscribe(() => {
          this.userSupervisors.push(supervisorsToAdd[0] as string);
        });
    }

    if (supervisorsToRemove[0] !== undefined) {
      const index = this.userSupervisors.indexOf(
        supervisorsToRemove[0] as string
      );

      this.userService
        .removeSupervisor(
          this.user?.id as string,
          supervisorsToRemove[0] as string
        )
        .subscribe(() => {
          this.userSupervisors.splice(index, 1);
        });
    }
  }

  onAddSupervise() {
    const userIdentity = this.authService.getIdentity()?.nameid as string;

    this.userService.getUserByIdentityId(userIdentity).subscribe((user) => {
      const addSupervisorId = user?.id as string;

      this.userService
        .addSupervisor(this.user?.id as string, addSupervisorId)
        .subscribe(() => {
          this.userSupervisors.push(addSupervisorId);

          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate([this.currentUrl]);
            });
        });
    });
  }

  reloadPage() {
    if (this.id === null) return;

    if (this.userHasBeenUpdated && this.roleHasBeenUpdated) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    }
  }
}
