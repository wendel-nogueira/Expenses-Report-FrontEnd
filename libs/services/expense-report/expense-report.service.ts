import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../src/environments/environment.development';
import { ExpenseReport } from '../../models/ExpenseReport';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExpenseReportService {
  constructor(private httpClient: HttpClient) {}

  apiURL = environment.expenseReportApiUrl;

  getExpenseReports(): Observable<ExpenseReport[]> {
    return this.httpClient
      .get<ExpenseReport[]>(this.apiURL)
      .pipe(retry(2), catchError(this.handleError));
  }

  getExpenseReportById(id: string): Observable<ExpenseReport> {
    return this.httpClient
      .get<ExpenseReport>(this.apiURL + '/' + id)
      .pipe(retry(2), catchError(this.handleError));
  }

  createExpenseReport(
    expenseReport: ExpenseReport
  ): Observable<ExpenseReport> {
    return this.httpClient
      .post<ExpenseReport>(this.apiURL, JSON.stringify(expenseReport))
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
