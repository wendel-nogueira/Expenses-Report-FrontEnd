import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private service: AuthService, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.service.getSession();

    if (token) {
      return true;
    }

    this.service.logout();
    this.router.navigate(['/login']);
    return false;
  }
}
