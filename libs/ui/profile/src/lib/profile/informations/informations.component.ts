/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Identity } from 'libs/models/Identity';
import { User } from 'libs/models/User';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IdentityService } from 'libs/services/identity/identity.service';
import { UserService } from 'libs/services/user/user.service';
import { AuthService } from 'libs/services/auth/auth.service';
import { Country } from 'libs/models/Country';
import { State } from 'libs/models/State';
import { AddressService } from 'libs/services/address/address.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-informations',
  standalone: true,
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class InformationsComponent implements OnInit {
  identity: Identity | null;
  user: User | null;
  loading = true;
  countries: Country[] = [];
  states: State[] = [];
  cities: string[] = [];
  currentUrl = this.router.url;

  constructor(
    private authService: AuthService,
    private identityService: IdentityService,
    private userService: UserService,
    private addressService: AddressService,
    private router: Router
  ) {
    this.identity = null;
    this.user = null;
  }

  ngOnInit() {
    this.getUser();
    this.getCountries();
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

  fields = [
    this.firstNameFormControl,
    this.lastNameFormControl,
    this.zipFormControl,
    this.countryFormControl,
    this.stateFormControl,
    this.cityFormControl,
    this.addressFormControl,
  ];

  getUser() {
    const identity = this.authService.getIdentity();

    if (!identity) return;

    const id = identity.nameid;

    this.identityService.getIdentityById(id).subscribe((identity) => {
      this.userService.getUserByIdentityId(id).subscribe((user) => {
        this.user = user;
        this.identity = identity;

        this.firstNameFormControl.setValue(this.user?.name.firstName);
        this.lastNameFormControl.setValue(this.user?.name.lastName);

        this.zipFormControl.setValue(this.user?.address.zip);
        this.countryFormControl.setValue(this.user?.address.country);
        this.onChangeCountry(this.user?.address.country);

        this.stateFormControl.setValue(this.user?.address.state);
        this.onChangeState(this.user?.address.state);

        this.cityFormControl.setValue(this.user?.address.city);
        this.addressFormControl.setValue(this.user?.address.address);
      });
    });
  }

  getCountries() {
    this.addressService.getCountries().subscribe((countries) => {
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

    this.addressService.getInfoByZipCode(zipCode).subscribe((info) => {
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

    this.addressService.getStates(countryName).subscribe((states) => {
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

    this.addressService
      .getCities(countryName, stateName)
      .subscribe((cities) => {
        if (cities.data) {
          this.cities = cities.data;
        }

        this.loading = false;
      });
  }

  onSubmit() {
    if (this.user?.id === null) return;
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

    if (this.verifyUserHasBeenUpdated()) {
      this.userService
        .updateUser(this.user?.id as string, userToUpdate)
        .subscribe(() => {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate([this.currentUrl]);
            });
        });
    }
  }

  verifyUserHasBeenUpdated(): boolean {
    if (
      this.user?.name.firstName !== this.firstNameFormControl.value ||
      this.user?.name.lastName !== this.lastNameFormControl.value ||
      this.user?.address.zip !== this.zipFormControl.value ||
      this.user?.address.country !== this.countryFormControl.value ||
      this.user?.address.state !== this.stateFormControl.value ||
      this.user?.address.city !== this.cityFormControl.value ||
      this.user?.address.address !== this.addressFormControl.value
    ) {
      return true;
    }

    return false;
  }
}
