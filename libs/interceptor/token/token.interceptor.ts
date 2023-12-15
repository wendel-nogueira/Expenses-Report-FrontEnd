import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.headers.get('remove-bearer')) {
      const formatedRequest = request.clone({
        headers: request.headers.delete('remove-bearer'),
      });

      return next.handle(formatedRequest);
    }

    const token = this.authService.getSession();

    let authRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Content: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (request.headers.get('remove-content-type')) {
      authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(authRequest);
  }
}
