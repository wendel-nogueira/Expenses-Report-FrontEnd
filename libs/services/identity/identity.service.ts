import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Identity } from '../../models/Identity';
import { Role } from '../../models/Role';
import { environment } from './../../../src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  constructor(private httpClient: HttpClient) {}

  apiURL = environment.identityApiUrl;

  getIdentities(): Observable<Identity[]> {
    return this.httpClient
      .get<Identity[]>(this.apiURL)
      .pipe(retry(2), catchError(this.handleError));
  }

  getIdentityById(id: string): Observable<Identity> {
    return this.httpClient
      .get<Identity>(`${this.apiURL}/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  getRoles(): Observable<Role[]> {
    return this.httpClient
      .get<Role[]>(`${this.apiURL}/roles/all`)
      .pipe(retry(2), catchError(this.handleError));
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.apiURL}/email/${email}`).pipe(
      catchError(() => {
        return EMPTY;
      })
    );
  }

  createIdentity(identity: Identity): Observable<Identity> {
    return this.httpClient
      .post<Identity>(this.apiURL, JSON.stringify(identity))
      .pipe(
        catchError(() => {
          return EMPTY;
        })
      );
  }

  updateIdentityRole(id: string, roleEnumId: number): Observable<Identity> {
    const body = {
      role: roleEnumId,
    };

    return this.httpClient
      .put<Identity>(`${this.apiURL}/${id}/role`, JSON.stringify(body))
      .pipe(retry(2), catchError(this.handleError));
  }

  activateIdentity(id: string): Observable<Identity> {
    return this.httpClient
      .put<Identity>(`${this.apiURL}/${id}/deleted`, null)
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteIdentity(id: string): Observable<Identity> {
    return this.httpClient
      .delete<Identity>(`${this.apiURL}/${id}`)
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
