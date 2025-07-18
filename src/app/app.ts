// Ficheiro: src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { AuthService } from './services/auth'; // Importa o serviço de autenticação
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  isLoggedIn$: Observable<boolean>; // Cria uma variável para guardar o "jornal" de login

  constructor(private authService: AuthService) {
    // Subscreve ao "jornal" do serviço para saber sempre se o utilizador está logado
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }
}