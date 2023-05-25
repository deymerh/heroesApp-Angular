import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, tap, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private user?: User;

  constructor(private readonly http: HttpClient) { }

  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    return structuredClone(this.user);
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User>(`${environment.baseUrl}/users/1`)
      .pipe(
        tap((user) => this.user = user),
        tap((user) => window.localStorage.setItem('token', user.id))
      )
  }

  checkAuthentication(): Observable<boolean> {
    if (!localStorage.getItem('token')) return of(false);
    const _token = localStorage.getItem('token');
    return this.http.get<User>(`${environment.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        map(user => !!user),
        catchError(() => of(false))
      );
  }

  logout() {
    this.user = undefined;
    window.localStorage.clear();
  }

}
