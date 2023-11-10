import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from './../../../src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private httpClient: HttpClient) {}

  token = environment.apiZipCodeToken;

  getCountries() {
    return this.httpClient
      .get<ApiResponse>('https://countriesnow.space/api/v0.1/countries/iso', {
        headers: {
          'remove-bearer': 'true',
        },
      })
      .pipe(retry(2), catchError(this.handleError));
  }

  getStates(countryName: string) {
    return this.httpClient
      .post<ApiResponse>(
        'https://countriesnow.space/api/v0.1/countries/states',
        {
          country: countryName,
        },
        {
          headers: {
            'remove-bearer': 'true',
          },
        }
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  getCities(countryName: string, stateName: string) {
    return this.httpClient
      .post<ApiResponse>(
        'https://countriesnow.space/api/v0.1/countries/state/cities',
        {
          country: countryName,
          state: stateName,
        },
        {
          headers: {
            'remove-bearer': 'true',
          },
        }
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  getInfoByZipCode(zipCode: string) {
    return this.httpClient
      .get<ZipResponse>(
        `https://app.zipcodebase.com/api/v1/search?apikey=${this.token}&codes=${zipCode}`,
        {
          headers: {
            'remove-bearer': 'true',
          },
        }
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    const errorMessage = {
      code: error.status,
      message: '',
      errors: [],
    };

    if (error.error instanceof ErrorEvent) {
      errorMessage.message = error.error.message;
    } else {
      errorMessage.message = error.message;
      errorMessage.errors = error.error.errors;
    }

    return throwError(errorMessage);
  }
}

interface ApiResponse {
  error: boolean;
  msg: string;
  data: any;
}

interface ZipResponse {
  query: any;
  results: any;
}
