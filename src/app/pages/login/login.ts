// O seu ficheiro TypeScript já está perfeito e não precisa de nenhuma alteração.
// Ele já importa o LogoComponent e tem a lógica de login correta.

import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth';
import { LogoComponent } from "../../components/logo/logo";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, LogoComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService) {}

  async onSubmit(event: Event) {
    event.preventDefault();
    await this.authService.login(this.username, this.password);
  }
}