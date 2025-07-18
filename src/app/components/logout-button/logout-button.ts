// Ficheiro: src/app/components/logout-button/logout-button.component.ts
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './logout-button.html',
  styleUrl: './logout-button.css'
})
export class LogoutButtonComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
