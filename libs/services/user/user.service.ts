import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { User } from '../../models/User';
import { environment } from './../../../src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  apiURL = environment.userApiUrl;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getUsers(): Observable<User[]> {
    return this.httpClient
      .get<User[]>(this.apiURL)
      .pipe(retry(2), catchError(this.handleError));
  }

  getUserById(id: string): Observable<User> {
    return this.httpClient
      .get<User>(`${this.apiURL}/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  getUserByIdentityId(id: string): Observable<User> {
    return this.httpClient
      .get<User>(`${this.apiURL}/identity/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  createUser(user: User): Observable<User> {
    return this.httpClient
      .post<User>(this.apiURL, JSON.stringify(user), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.httpClient
      .put<User>(`${this.apiURL}/${id}`, JSON.stringify(user))
      .pipe(retry(2), catchError(this.handleError));
  }

  getSupervisors(id: string): Observable<User[]> {
    return this.httpClient
      .get<User[]>(`${this.apiURL}/${id}/supervisors`)
      .pipe(retry(2), catchError(this.handleError));
  }

  addSupervisor(id: string, supervisorId: string): Observable<void> {
    return this.httpClient
      .post<void>(`${this.apiURL}/${id}/supervisors/${supervisorId}`, null)
      .pipe(retry(2), catchError(this.handleError));
  }

  removeSupervisor(id: string, supervisorId: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiURL}/${id}/supervisors/${supervisorId}`)
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
