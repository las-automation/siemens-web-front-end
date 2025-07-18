// Ficheiro: src/app/services/auth.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usamos um BehaviorSubject para guardar e "transmitir" o estado de login
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private router: Router) { }

  // Verifica se existe um "token" de login no localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem('user_token');
  }

  // Método de login (simulado)
  login(username: string, password: string): boolean {
    // Num projeto real, aqui faríamos uma chamada a uma API.
    // Por agora, vamos aceitar qualquer utilizador/senha.
    if (username && password) {
      localStorage.setItem('user_token', 'fake_auth_token');
      this.loggedIn.next(true); // Avisa a aplicação que o estado mudou para "logado"
      this.router.navigate(['/dashboard']); // Navega para o dashboard após o login
      return true;
    }
    return false;
  }

  // Método de logout
  logout(): void {
    localStorage.removeItem('user_token');
    this.loggedIn.next(false); // Avisa a aplicação que o estado mudou para "não logado"
    this.router.navigate(['/login']); // Navega para a página de login
  }
}
