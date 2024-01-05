import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../src/environments/environment.development';
import { Expense } from '../../models/Expense';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private httpClient: HttpClient) {}

  apiURL = environment.expenseApiUrl;

  getExpenses(): Observable<Expense[]> {
    return this.httpClient
      .get<Expense[]>(this.apiURL)
      .pipe(retry(2), catchError(this.handleError));
  }

  getExpenseById(id: string): Observable<Expense> {
    return this.httpClient
      .get<Expense>(this.apiURL + '/' + id)
      .pipe(retry(2), catchError(this.handleError));
  }

  createExpense(expenseReport: string, expense: Expense): Observable<Expense> {
    return this.httpClient
      .post<Expense>(`${this.apiURL}/${expenseReport}`, JSON.stringify(expense))
      .pipe(retry(2), catchError(this.handleError));
  }

  updateExpense(expense: Expense): Observable<Expense> {
    return this.httpClient
      .put<Expense>(this.apiURL + '/' + expense.id, JSON.stringify(expense))
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteExpense(expense: Expense) {
    return this.httpClient
      .delete<Expense>(this.apiURL + '/' + expense.id)
      .pipe(retry(2), catchError(this.handleError));
  }

  evaluateExpense(expense: Expense) {
    return this.httpClient
      .put<Expense>(
        this.apiURL + '/' + expense.id + '/evaluate',
        JSON.stringify(expense)
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
