import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountantGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const role = this.authService.getIdentity()?.role;

    if (role === 'Accountant') {
      return true;
    }

    return false;
  }
}
