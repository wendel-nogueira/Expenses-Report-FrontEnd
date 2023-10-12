/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorStateMatcher } from '@angular/material/core';
import { Country } from 'libs/models/Country';
import { State } from 'libs/models/State';
import { Router } from '@angular/router';
import { UserService } from '../../../../../../services/user/user.service';
import { IdentityService } from '../../../../../../services/identity/identity.service';
import { AddressService } from './../../../../../../services/address/address.service';
import { Identity } from '../../../../../../models/Identity';
import { User } from '../../../../../../models/User';
import { Role } from '../../../../../../models/Role';

@Component({
  selector: 'lib-user-edit',
  standalone: true,
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
    MatSelectModule,
    MatIconModule,
    RouterModule,
    MatProgressSpinnerModule,
  ],
})
export class UserEditComponent implements OnInit {
  id: string | null = null;
  allUsers: User[] = [];
  user: User | null;
  identity: Identity | null;
  userSupervisors: string[] = [];
  userSupervisorsToUpdate: string[] = [];
  emailExists = false;
  roles: Role[] = [];
  countries: Country[] = [];
  states: State[] = [];
  cities: string[] = [];
  loading = true;
  currentUrl = this.router.url;

  userHasBeenUpdated = false;
  roleHasBeenUpdated = false;

  constructor(
    private route: ActivatedRoute,
    private identityService: IdentityService,
    private userService: UserService,
    private address: AddressService,
    private router: Router
  ) {
    this.user = null;
    this.identity = null;
  }

  matcher = new ErrorStateMatcher();

  firstNameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
  ]);
  lastNameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
  ]);
  roleFormControl = new FormControl('', [Validators.required]);
  zipFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(10),
  ]);
  countryFormControl = new FormControl('', [Validators.required]);
  stateFormControl = new FormControl('', [Validators.required]);
  cityFormControl = new FormControl('', [Validators.required]);
  addressFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
  ]);

  supervisorsFormControl = new FormControl<string[] | null>([]);

  fields = [
    this.firstNameFormControl,
    this.lastNameFormControl,
    this.emailFormControl,
    this.roleFormControl,
    this.zipFormControl,
    this.countryFormControl,
    this.stateFormControl,
    this.cityFormControl,
    this.addressFormControl,
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });

    this.emailFormControl.disable();

    this.getRoles();
    this.getUser();
    this.getCountries();
  }

  getRoles() {
    this.identityService.getRoles().subscribe((roles) => {
      this.roles = roles;
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

        this.firstNameFormControl.setValue(this.user?.name.firstName);
        this.lastNameFormControl.setValue(this.user?.name.lastName);
        this.emailFormControl.setValue(this.identity?.email);
        this.roleFormControl.setValue(
          this.roles.find((role) => role.name === this.identity?.roleName)
            ?.id || null
        );

        this.zipFormControl.setValue(this.user?.address.zip);
        this.countryFormControl.setValue(this.user?.address.country);
        this.onChangeCountry(this.user?.address.country);

        this.stateFormControl.setValue(this.user?.address.state);
        this.onChangeState(this.user?.address.state);

        this.cityFormControl.setValue(this.user?.address.city);
        this.addressFormControl.setValue(this.user?.address.address);

        this.getAllUsers();
      });
    });
  }

  getAllUsers() {
    this.userService.getUsers().subscribe((users) => {
      this.allUsers = users.filter((user) => user.id !== this.user?.id);
      
      this.getUserSupervisors();
    });
  }

  getUserSupervisors() {
    this.userService
      .getSupervisors(this.user?.id as string)
      .subscribe((supervisors) => {
        this.userSupervisors = supervisors.map((supervisor) => supervisor.id);

        this.supervisorsFormControl.setValue(this.userSupervisors);
      });
  }

  getCountries() {
    this.address.getCountries().subscribe((countries) => {
      if (countries.data) {
        this.countries = countries.data;
      }
    });
  }

  formatZip() {
    const zipCode = this.zipFormControl.value;

    if (!zipCode) return;

    this.zipFormControl.setValue(zipCode.replace(/[^0-9]/g, ''));
  }

  onChangeZip() {
    const zipCode = this.zipFormControl.value;

    if (!zipCode) return;

    let countryName = '';
    let stateName = '';
    let cityName = '';

    this.address.getInfoByZipCode(zipCode).subscribe((info) => {
      if (info.results && info.results[zipCode] && info.results[zipCode][0]) {
        countryName = this.countries.find(
          (country) => country.Iso2 === info.results[zipCode][0].country_code
        )?.name as string;
        stateName = info.results[zipCode][0].state_en;
        cityName = info.results[zipCode][0].province;

        this.countryFormControl.setValue(countryName);
        this.onChangeCountry(countryName);

        this.stateFormControl.setValue(stateName);
        this.onChangeState(stateName);

        this.cityFormControl.setValue(cityName);
      }
    });
  }

  onChangeCountry(country: string | null) {
    const countryName = country || (this.countryFormControl.value as string);

    this.states = [];
    this.cities = [];

    this.stateFormControl.setValue('');
    this.cityFormControl.setValue('');

    this.address.getStates(countryName).subscribe((states) => {
      if (states.data && states.data.states) {
        this.states = states.data.states;
      }
    });
  }

  onChangeState(state: string | null) {
    const countryName = this.countryFormControl.value as string;
    const stateName = state || (this.stateFormControl.value as string);

    this.cities = [];
    this.cityFormControl.setValue('');

    this.address.getCities(countryName, stateName).subscribe((cities) => {
      if (cities.data) {
        this.cities = cities.data;
      }

      this.loading = false;
    });
  }

  onSubmit() {
    if (this.id === null) return;
    if (this.fields.some((field) => field.invalid)) return;

    const userToUpdate: User = {
      id: this.user?.id as string,
      identityId: this.identity?.id as string,
      name: {
        firstName: this.firstNameFormControl.value as string,
        lastName: this.lastNameFormControl.value as string,
      },
      address: {
        zip: this.zipFormControl.value as string,
        country: this.countryFormControl.value as string,
        state: this.stateFormControl.value as string,
        city: this.cityFormControl.value as string,
        address: this.addressFormControl.value as string,
      },
    };

    const identityRole = this.roles.find(
      (role) => role.name === this.identity?.roleName
    )?.enumId as number;

    const identityRoleToUpdate = this.roles.find(
      (role) => role.id === this.roleFormControl.value
    )?.enumId as number;

    identityRole !== identityRoleToUpdate
      ? (this.roleHasBeenUpdated = false)
      : (this.roleHasBeenUpdated = true);
    this.verifyUserHasBeenUpdated()
      ? (this.userHasBeenUpdated = false)
      : (this.userHasBeenUpdated = true);

    if (identityRole !== identityRoleToUpdate) {
      this.identityService
        .updateIdentityRole(this.id, identityRoleToUpdate)
        .subscribe(() => {
          this.roleHasBeenUpdated = true;

          this.reloadPage();
        });
    }

    if (this.verifyUserHasBeenUpdated()) {
      this.userService
        .updateUser(this.user?.id as string, userToUpdate)
        .subscribe(() => {
          this.userHasBeenUpdated = true;

          this.reloadPage();
        });
    }
  }

  onActivate() {
    if (this.id === null) return;

    this.identityService.activateIdentity(this.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    });
  }

  onDeactivate() {
    if (this.id === null) return;

    this.identityService.deleteIdentity(this.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    });
  }

  onChangeSupervisors() {
    const supervisorsToUpdate = this.supervisorsFormControl.value as string[];

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

  verifyUserHasBeenUpdated(): boolean {
    let userHasBeenUpdated = false;

    if (
      this.user?.name.firstName !== this.firstNameFormControl.value ||
      this.user?.name.lastName !== this.lastNameFormControl.value ||
      this.user?.address.zip !== this.zipFormControl.value ||
      this.user?.address.country !== this.countryFormControl.value ||
      this.user?.address.state !== this.stateFormControl.value ||
      this.user?.address.city !== this.cityFormControl.value ||
      this.user?.address.address !== this.addressFormControl.value
    ) {
      userHasBeenUpdated = true;
    }

    return userHasBeenUpdated;
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
