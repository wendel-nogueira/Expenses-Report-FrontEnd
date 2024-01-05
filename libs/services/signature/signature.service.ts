import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../src/environments/environment.development';
import { Signature } from '../../models/Signature';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SignatureService {
  constructor(private httpClient: HttpClient) {}

  apiURL = environment.signatureApiUrl;

  getIp(): Observable<{
    ip: string;
  }> {
    return this.httpClient
      .get<{
        ip: string;
      }>('http://api.ipify.org/?format=json', {
        headers: { 'remove-bearer': 'true' },
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  signExpenseReport(
    expenseReportId: string,
    signature: Signature
  ): Observable<Signature> {
    return this.httpClient
      .post<Signature>(`${this.apiURL}/${expenseReportId}`, signature)
      .pipe(retry(1), catchError(this.handleError));
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
