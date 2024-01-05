import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../src/environments/environment.development';
import { File } from '../../models/File';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(private httpClient: HttpClient) {}

  apiURL = environment.exportApiUrl;

  exportUsers(): Observable<File> {
    return this.httpClient
      .get<File>(this.apiURL + '/users-and-identities')
      .pipe(retry(2), catchError(this.handleError));
  }

  exportDepartments(): Observable<File> {
    return this.httpClient
      .get<File>(this.apiURL + '/departments')
      .pipe(retry(2), catchError(this.handleError));
  }

  exportProjects(): Observable<File> {
    return this.httpClient
      .get<File>(this.apiURL + '/projects')
      .pipe(retry(2), catchError(this.handleError));
  }

  exportExpenseAccounts(): Observable<File> {
    return this.httpClient
      .get<File>(this.apiURL + '/expense-accounts')
      .pipe(retry(2), catchError(this.handleError));
  }

  exportExpenseReports(): Observable<File> {
    return this.httpClient
      .get<File>(this.apiURL + '/expense-reports')
      .pipe(retry(2), catchError(this.handleError));
  }

  exportExpenseReport(expenseReportId: string): Observable<File> {
    return this.httpClient
      .get<File>(this.apiURL + '/expense-reports/' + expenseReportId)
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
