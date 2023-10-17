import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserExistsGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const identity = this.authService.getIdentity();

    if (!identity) {
      this.authService.logout();
      return false;
    }

    return this.userService.getUserByIdentityId(identity.nameid).subscribe(() => {
      return true;
    }, () => {
      this.router.navigate(['/update-user']);
      return false;
    }) as unknown as boolean;
  }
}
