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
    // --- TESTE DE DIAGNÓSTICO ---
    // Esta linha irá mostrar no console do navegador exatamente o que estamos a enviar.
    console.log('A tentar fazer login com:', { username, password });

    try {
      const response = await fetch('https://siemens-web-back-end.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) { // Status 200-299
        const data = await response.json();
        if (data && data.accessToken) {
          localStorage.setItem('user_token', data.accessToken);
          this.loggedIn.next(true);
          this.router.navigate(['/relatorios']);
          return true;
        }
      }

      // Se a resposta for 401 ou outro erro
      alert('Utilizador ou senha inválidos.');
      return false;

    } catch (error) {
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
