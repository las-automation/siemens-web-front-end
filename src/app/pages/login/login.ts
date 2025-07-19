// Ficheiro: src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa o FormsModule
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  // Variáveis para guardar os dados do formulário
  username = '';
  password = '';

  constructor(private authService: AuthService) {}

  // O método agora é 'async' para poder esperar pela resposta da API
  async onSubmit(event: Event) {
    event.preventDefault();
    await this.authService.login(this.username, this.password);
  }
}