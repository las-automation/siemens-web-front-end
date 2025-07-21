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

  // Método de login SIMULADO
  login(username: string, password: string): void {
    // Num projeto real, aqui estaria a chamada à API.
    // Para o nosso frontend, vamos simplesmente assumir que o login foi bem-sucedido.
    console.log('Login simulado com sucesso!');
    localStorage.setItem('user_token', 'fake_auth_token_for_dev');
    this.loggedIn.next(true);
    this.router.navigate(['/relatorios']); // Redireciona para a página de relatórios
  }

  // // MÉTODO DE LOGIN ATUALIZADO
  // async login(username: string, password: string): Promise<boolean> {
  //   // --- TESTE DE DIAGNÓSTICO ---
  //   // Esta linha irá mostrar no console do navegador exatamente o que estamos a enviar.
  //   console.log('A tentar fazer login com:', { username, password });

  //   try {
  //     const response = await fetch('http://localhost:8080/login', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ username, password })
  //     });

  //     if (response.ok) { // Status 200-299
  //       const data = await response.json();
  //       if (data && data.token) {
  //         localStorage.setItem('user_token', data.token);
  //         this.loggedIn.next(true);
  //         this.router.navigate(['/relatorios']); 
  //         return true;
  //       }
  //     }

  //     // Se a resposta for 401 ou outro erro
  //     alert('Utilizador ou senha inválidos.');
  //     return false;

  //   } catch (error) {
  //     console.error('Erro ao tentar fazer login:', error);
  //     alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
  //     return false;
  //   }
  // }

  logout(): void {
    localStorage.removeItem('user_token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}