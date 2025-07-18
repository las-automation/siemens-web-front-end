// Ficheiro: src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// Imports do Angular Material para o formulário
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
// Imports do nosso projeto
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  // Este método é chamado quando o formulário é submetido
  onSubmit(event: Event): void {
    event.preventDefault(); // Impede o recarregamento da página
    // Simplesmente chama o método de login do serviço
    this.authService.login('testuser', 'password');
  }
}