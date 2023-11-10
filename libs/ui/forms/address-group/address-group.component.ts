import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressService } from '../../../services/address/address.service';
import { Country } from '../../../models/Country';
import {
  SelectComponent,
  SelectOption as SelectOption,
} from '../../forms/select/select.component';
import { InputTextComponent } from '../input-text/input-text.component';
import { FormGroupComponent } from '../form-group/form-group.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-address-group',
  standalone: true,
  templateUrl: './address-group.component.html',
  styleUrls: ['./address-group.component.css'],
  imports: [
    CommonModule,
    SelectComponent,
    InputTextComponent,
    FormGroupComponent,
    MatProgressSpinnerModule,
  ],
})
export class AddressGroupComponent implements OnChanges {
  @Input() zipValue = '';
  @Input() countryValue = '';
  @Input() stateValue = '';
  @Input() cityValue = '';
  @Input() addressValue = '';
  @Input() loadingValue = true;
  @Input() isDisabled = false;

  @Output() changeZipValue = new EventEmitter();
  @Output() changeZipIsInvalid = new EventEmitter();
  @Output() changeCountryValue = new EventEmitter();
  @Output() changeCountryIsInvalid = new EventEmitter();
  @Output() changeStateValue = new EventEmitter();
  @Output() changeStateIsInvalid = new EventEmitter();
  @Output() changeCityValue = new EventEmitter();
  @Output() changeCityIsInvalid = new EventEmitter();
  @Output() changeAddressValue = new EventEmitter();
  @Output() changeAddressIsInvalid = new EventEmitter();
  @Output() changeLoading = new EventEmitter();

  allCountries: Country[] = [];
  countries: SelectOption[] = [];
  states: SelectOption[] = [];
  cities: SelectOption[] = [];

  zip = '';
  zipIsInvalid = false;
  country = '';
  countryIsInvalid = false;
  state = '';
  stateIsInvalid = false;
  city = '';
  cityIsInvalid = false;
  address = '';
  addressIsInvalid = false;
  loading = true;

  constructor(private addressService: AddressService) {
    this.getCountries();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['zipValue']) {
      this.zip = changes['zipValue'].currentValue;
      this.zipChangeValue(this.zip);
    }

    if (changes['countryValue']) {
      this.country = changes['countryValue'].currentValue;
      this.countryChangeValue(this.country);
    }

    if (changes['stateValue']) {
      this.state = changes['stateValue'].currentValue;
      this.stateChangeValue(this.state);
    }

    if (changes['cityValue']) {
      this.city = changes['cityValue'].currentValue;
      this.cityChangeValue(this.city);
    }

    if (changes['addressValue']) {
      this.address = changes['addressValue'].currentValue;
      this.addressChangeValue(this.address);
    }
  }

  getCountries() {
    this.addressService.getCountries().subscribe((countries) => {
      if (countries.data) {
        const allCountries: SelectOption[] = [];

        countries.data.forEach((country: any) => {
          allCountries.push({
            value: country.name,
            viewValue: country.name,
          });
        });

        this.countries = allCountries;
        this.allCountries = countries.data;
      }
    });
  }

  zipChangeValue(zip: string | null) {
    if (!zip) return;

    this.changeZipValue.emit(zip);
    this.changeZipIsInvalid.emit(this.zipIsInvalid);

    this.addressService.getInfoByZipCode(zip).subscribe((info) => {
      if (info.results && info.results[zip] && info.results[zip][0]) {
        const countryName = this.allCountries.find(
          (country) => country.Iso2 === info.results[zip][0].country_code
        )?.name as string;
        const stateName = info.results[zip][0].state_en;
        const cityName = info.results[zip][0].province;

        this.country = countryName;
        this.countryChangeValue(countryName);

        this.state = stateName;
        this.stateChangeValue(stateName);

        this.city = cityName;
        this.changeCityValue.emit(cityName);
        this.changeCityIsInvalid.emit(this.cityIsInvalid);
      }
    });
  }

  countryChangeValue(country: string | null) {
    if (!country) return;

    this.changeCountryValue.emit(country);
    this.changeCountryIsInvalid.emit(this.countryIsInvalid);
    this.country = country;

    this.states = [];
    this.cities = [];

    this.addressService.getStates(country).subscribe((states) => {
      if (states.data && states.data.states) {
        const allStates: SelectOption[] = [];

        states.data.states.forEach((state: any) => {
          allStates.push({
            value: state.name,
            viewValue: state.name,
          });
        });

        this.states = allStates;
      }
    });
  }

  stateChangeValue(state: string | null) {
    if (!state) return;

    this.changeStateValue.emit(state);
    this.changeStateIsInvalid.emit(this.stateIsInvalid);

    if (!this.country) return;

    this.cities = [];

    this.addressService.getCities(this.country, state).subscribe((cities) => {
      const allCities: SelectOption[] = [];

      cities.data.forEach((city: any) => {
        allCities.push({
          value: city,
          viewValue: city,
        });
      });

      this.cities = allCities;
      this.changeLoading.emit(false);
      this.loading = false;
    });
  }

  cityChangeValue(city: string | null) {
    if (!city) return;

    this.changeCityValue.emit(city);
    this.changeCityIsInvalid.emit(this.cityIsInvalid);
    this.city = city;
  }

  addressChangeValue(address: string | null) {
    if (!address) return;

    this.changeAddressValue.emit(address);
    this.changeAddressIsInvalid.emit(this.addressIsInvalid);
    this.address = address;
  }
}
