// Ficheiro: src/app/services/auth.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private router: Router) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('user_token');
  }

  logout(): void {
    localStorage.removeItem('user_token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}