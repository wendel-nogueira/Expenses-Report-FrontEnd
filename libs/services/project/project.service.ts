import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../src/environments/environment.development';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Project } from '../../models/Project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  
  constructor(private httpClient: HttpClient) {}

  apiURL = environment.projectApiUrl;

  getProjects(): Observable<Project[]> {
    return this.httpClient
      .get<Project[]>(this.apiURL)
      .pipe(retry(2), catchError(this.handleError));
  }

  getProjectById(id: string): Observable<Project> {
    return this.httpClient
      .get<Project>(`${this.apiURL}/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  checkCodeExists(code: string): Observable<Project> {
    return this.httpClient
      .get<Project>(`${this.apiURL}/code/${code}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  createProject(project: Project): Observable<Project> {
    return this.httpClient
      .post<Project>(this.apiURL, project)
      .pipe(retry(2), catchError(this.handleError));
  }

  updateProject(id: string, project: Project): Observable<Project> {
    return this.httpClient
      .put<Project>(`${this.apiURL}/${id}`, project)
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteProject(id: string): Observable<Project> {
    return this.httpClient
      .delete<Project>(`${this.apiURL}/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  activateProject(id: string): Observable<Project> {
    return this.httpClient
      .patch<Project>(`${this.apiURL}/${id}/activate`, null)
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
