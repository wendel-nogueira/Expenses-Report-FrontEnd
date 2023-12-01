import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../src/environments/environment.development';
import { ExpenseAccount } from '../../models/ExpenseAccount';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExpenseAccountService {
  constructor(private httpClient: HttpClient) {}

  apiURL = environment.expenseAccountApiUrl;

  getExpenseAccounts(): Observable<ExpenseAccount[]> {
    return this.httpClient
      .get<ExpenseAccount[]>(this.apiURL)
      .pipe(retry(2), catchError(this.handleError));
  }

  getExpenseAccountById(id: string): Observable<ExpenseAccount> {
    return this.httpClient
      .get<ExpenseAccount>(`${this.apiURL}/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  checkCodeExists(code: string): Observable<ExpenseAccount> {
    return this.httpClient
      .get<ExpenseAccount>(`${this.apiURL}/code/${code}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  createExpenseAccount(
    expenseAccount: ExpenseAccount
  ): Observable<ExpenseAccount> {
    return this.httpClient
      .post<ExpenseAccount>(this.apiURL, JSON.stringify(expenseAccount))
      .pipe(retry(2), catchError(this.handleError));
  }

  updateExpenseAccount(
    id: string,
    expenseAccount: ExpenseAccount
  ): Observable<ExpenseAccount> {
    return this.httpClient
      .put<ExpenseAccount>(`${this.apiURL}/${id}`, expenseAccount)
      .pipe(retry(2), catchError(this.handleError));
  }

  activateProject(id: string): Observable<ExpenseAccount> {
    return this.httpClient
      .patch<ExpenseAccount>(`${this.apiURL}/${id}/activate`, null)
      .pipe(retry(2), catchError(this.handleError));
  }

  deactivateProject(id: string): Observable<ExpenseAccount> {
    return this.httpClient
      .delete<ExpenseAccount>(`${this.apiURL}/${id}/deactivate`)
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
