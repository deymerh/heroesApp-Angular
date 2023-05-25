import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanMatch {

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) { }

  checkAuthStatus(): Observable<boolean> | boolean {
    return this.authService.checkAuthentication()
      .pipe(
        tap((isAthenticated) => {
          if (!isAthenticated) {
            this.router.navigate(['./auth/login'])
          }
        })
      )
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.checkAuthStatus();
  }
  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
    return this.checkAuthStatus();
  }
}
