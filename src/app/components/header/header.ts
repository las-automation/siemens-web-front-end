import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LogoComponent } from '../logo/logo';
import { LogoutButtonComponent } from '../logout-button/logout-button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatTabsModule, RouterLink, RouterLinkActive, LogoComponent, LogoutButtonComponent],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  // CORRIGIDO: A lista agora tem apenas um link e o label foi atualizado.
  navLinks = [
    { path: 'relatorios', label: 'Relatórios' },
  ];
}
