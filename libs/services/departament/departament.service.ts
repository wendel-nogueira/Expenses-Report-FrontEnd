import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../src/environments/environment.development';
import { Departament } from '../../models/Departament';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartamentService {
  constructor(private httpClient: HttpClient) {}

  apiURL = environment.departamentApiUrl;

  getDepartaments(): Observable<Departament[]> {
    return this.httpClient
      .get<Departament[]>(this.apiURL)
      .pipe(retry(2), catchError(this.handleError));
  }

  createDepartament(departament: Departament): Observable<Departament> {
    return this.httpClient
      .post<Departament>(this.apiURL, JSON.stringify(departament))
      .pipe(retry(2), catchError(this.handleError));
  }

  updateDepartament(departament: Departament): Observable<Departament> {
    return this.httpClient
      .put<Departament>(`${this.apiURL}/${departament.id}`, JSON.stringify(departament))
      .pipe(retry(2), catchError(this.handleError));
  }

  checkAcronymExists(acronym: string): Observable<boolean> {
    return this.httpClient
      .get<boolean>(`${this.apiURL}/acronym/${acronym}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  getDepartamentById(id: string): Observable<Departament> {
    return this.httpClient
      .get<Departament>(`${this.apiURL}/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  getDepartamentManagers(id: string): Observable<Managers> {
    return this.httpClient
      .get<Managers>(`${this.apiURL}/${id}/managers`)
      .pipe(retry(2), catchError(this.handleError));
  }

  addDepartamentManager(id: string, managerId: string): Observable<void> {
    return this.httpClient
      .post<void>(`${this.apiURL}/${id}/managers/${managerId}`, null)
      .pipe(retry(2), catchError(this.handleError));
  }

  removeDepartamentManager(id: string, managerId: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiURL}/${id}/managers/${managerId}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  getDepartamentUsers(id: string): Observable<Users> {
    return this.httpClient
      .get<Users>(`${this.apiURL}/${id}/users`)
      .pipe(retry(2), catchError(this.handleError));
  }

  addDepartamentUser(id: string, userId: string): Observable<void> {
    return this.httpClient
      .post<void>(`${this.apiURL}/${id}/users/${userId}`, null)
      .pipe(retry(2), catchError(this.handleError));
  }

  removeDepartamentUser(id: string, userId: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiURL}/${id}/users/${userId}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  activateDepartament(id: string): Observable<void> {
    return this.httpClient
      .patch<void>(`${this.apiURL}/${id}/activate`, null)
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteDepartament(id: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiURL}/${id}`)
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

interface Managers {
  managersId: string[];
}

interface Users {
  usersId: string[];
}