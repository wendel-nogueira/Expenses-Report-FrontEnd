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
      .get<ApiResponse>('https://countriesnow.space/api/v0.1/countries/iso')
      .pipe(retry(2), catchError(this.handleError));
  }

  getStates(countryName: string) {
    return this.httpClient
      .post<ApiResponse>(
        'https://countriesnow.space/api/v0.1/countries/states',
        {
          country: countryName,
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
        }
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  getInfoByZipCode(zipCode: string) {
    return this.httpClient
      .get<ZipResponse>(
        `https://app.zipcodebase.com/api/v1/search?apikey=${this.token}&codes=${zipCode}`
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code : ${error.status}\nMessage : ${error.message}`;
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