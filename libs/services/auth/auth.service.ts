import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from './../../../src/environments/environment.development';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Identity } from '../../models/Identity';
import { TokenIdentity } from './../../models/TokenIdentity';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  apiURL = environment.identityApiUrl;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  login(email: string, password: string): Observable<LoginResponse> {
    const body = {
      email,
      password,
    };

    return this.httpClient
      .post<LoginResponse>(
        `${this.apiURL}/login`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  logout(): void {
    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }

  createSession(token: string): void {
    return localStorage.setItem('token', token);
  }

  getSession(): string | void {
    const token = localStorage.getItem('token');

    if (!token) return this.logout();

    if (this.jwtHelper.isTokenExpired(token)) return this.logout();

    return token;
  }

  getIdentity(): TokenIdentity | void {
    const token = this.getSession();

    if (!token) return;

    return this.jwtHelper.decodeToken(token) as TokenIdentity;
  }

  me(): Observable<Identity> {
    return this.httpClient.get<Identity>(`${this.apiURL}/me`).pipe(
      catchError(() => {
        return EMPTY;
      })
    );
  }

  sendResetPasswordEmail(email: string): Observable<void> {
    const body = {
      email,
    };

    return this.httpClient
      .post<void>(
        `${this.apiURL}/password/reset`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  changePassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Observable<void> {
    const body = {
      newPassword: password,
      repeatNewPassword: confirmPassword,
    };

    return this.httpClient
      .put<void>(
        `${this.apiURL}/password?token=${token}`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  changeEmail(email: string): Observable<void> {
    const body = {
      newEmail: email,
    };

    return this.httpClient
      .put<void>(`${this.apiURL}/email`, JSON.stringify(body))
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

interface LoginResponse {
  token: string;
}
