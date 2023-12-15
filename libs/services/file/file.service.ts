import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../src/environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private httpClient: HttpClient) {}

  apiURL = environment.fileApiUrl;

  getFiles(): Observable<any[]> {
    return this.httpClient
      .get<any[]>(this.apiURL)
      .pipe(retry(2), catchError(this.handleError));
  }

  uploadFile(file: any): Observable<any> {
    const formData = new FormData();
    formData.append('inputFile', file);

    return this.httpClient
      .post<any>(this.apiURL, formData, {
        headers: {
          'remove-content-type': 'true',
        },
      })
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
