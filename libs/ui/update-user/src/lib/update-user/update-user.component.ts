/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'libs/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'libs/services/user/user.service';
import { IdentityService } from 'libs/services/identity/identity.service';
import { TokenIdentity } from 'libs/models/TokenIdentity';
import { Identity } from './../../../../../models/Identity';
import { User } from './../../../../../models/User';

import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { Country } from 'libs/models/Country';
import { State } from 'libs/models/State';
import { AddressService } from 'libs/services/address/address.service';

@Component({
  selector: 'lib-update-user',
  standalone: true,
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class UpdateUserComponent implements OnInit {
  tokenIdentity: TokenIdentity | void = undefined;
  identity: Identity | null;
  loading = true;
  countries: Country[] = [];
  states: State[] = [];
  cities: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private identityService: IdentityService,
    private addressService: AddressService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
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
      }, console.error);

    this.getCountries();
  }

  matcher = new ErrorStateMatcher();

  nameFormGroup = this.formBuilder.group({
    firstName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    ],
  });
  addressFormGroup = this.formBuilder.group({
    zip: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(10)],
    ],
    country: ['', [Validators.required]],
    state: ['', [Validators.required]],
    city: ['', [Validators.required]],
    address: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    ],
  });

  getCountries() {
    this.addressService.getCountries().subscribe((countries) => {
      if (countries.data) {
        this.countries = countries.data;
      }
    });
  }

  formatZip() {
    const zipCode = this.addressFormGroup.get('zip')?.value;

    if (!zipCode) return;

    this.addressFormGroup.get('zip')?.setValue(zipCode.replace(/[^0-9]/g, ''));
  }

  onChangeZip() {
    const zipCode = this.addressFormGroup.get('zip')?.value;

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

        this.addressFormGroup.get('country')?.setValue(countryName);
        this.onChangeCountry(countryName);

        this.addressFormGroup.get('state')?.setValue(stateName);
        this.onChangeState(stateName);

        this.addressFormGroup.get('city')?.setValue(cityName);
      }
    });
  }

  onChangeCountry(country: string | null) {
    const countryName =
      country || (this.addressFormGroup.get('country')?.value as string);

    this.states = [];
    this.cities = [];

    this.addressFormGroup.get('state')?.setValue('');
    this.addressFormGroup.get('city')?.setValue('');

    this.addressService.getStates(countryName).subscribe((states) => {
      if (states.data && states.data.states) {
        this.states = states.data.states;
      }
    });
  }

  onChangeState(state: string | null) {
    const countryName = this.addressFormGroup.get('country')?.value as string;
    const stateName =
      state || (this.addressFormGroup.get('state')?.value as string);

    this.cities = [];
    this.addressFormGroup.get('city')?.setValue('');

    this.addressService
      .getCities(countryName, stateName)
      .subscribe((cities) => {
        if (cities.data) {
          this.cities = cities.data;
        }

        this.loading = false;
      });
  }

  onSubmit(): void {
    if (!this.identity) return;

    if (this.nameFormGroup.invalid) return;

    if (this.addressFormGroup.invalid) return;

    const user: User = {
      identityId: this.identity.id,
      name: {
        firstName: this.nameFormGroup.get('firstName')?.value as string,
        lastName: this.nameFormGroup.get('lastName')?.value as string,
      },
      address: {
        address: this.addressFormGroup.get('address')?.value as string,
        city: this.addressFormGroup.get('city')?.value as string,
        state: this.addressFormGroup.get('state')?.value as string,
        zip: this.addressFormGroup.get('zip')?.value as string,
        country: this.addressFormGroup.get('country')?.value as string,
      },
    };

    this.userService.createUser(user).subscribe(
      () => {
        this.authService.logout();
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
