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

  // MÉTODO DE LOGIN ATUALIZADO
  async login(username: string, password: string): Promise<boolean> {
    try {
      // CORREÇÃO: Usamos 'http' em vez de 'https' para o servidor local.
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      // Se a resposta da API for bem-sucedida (status 2xx)
      if (response.ok) {
        const data = await response.json();
        if (data && data.token) {
          localStorage.setItem('user_token', data.token); // Guarda o token recebido
          this.loggedIn.next(true);
          // Como removemos o dashboard, vamos redirecionar para uma página 'home'
          this.router.navigate(['/home']); 
          return true;
        }
      }

      // Se a resposta não for 'ok' ou não tiver um token
      alert('Utilizador ou senha inválidos.');
      return false;

    } catch (error) {
      // Se houver um erro de rede (como o servidor estar desligado)
      console.error('Erro ao tentar fazer login:', error);
      alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('user_token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}