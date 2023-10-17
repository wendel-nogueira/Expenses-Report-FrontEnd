import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const url = this.router.url;

    if (url === '/login' || url.includes('/change-password')) {
      return next.handle(request);
    }

    const token = this.authService.getSession();
    const authRequest = request.clone({
      setHeaders: {
        Content: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(authRequest);
  }
}
