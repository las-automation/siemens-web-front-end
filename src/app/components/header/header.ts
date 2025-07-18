// Ficheiro: src/app/components/header/header.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive } from '@angular/router';
// 1. Importa os nossos novos componentes com os nomes corretos
import { LogoComponent } from '../logo/logo';
import { LogoutButtonComponent } from '../logout-button/logout-button';

@Component({
  selector: 'app-header',
  standalone: true,
  // 2. Adiciona os novos componentes aos imports
  imports: [CommonModule, MatTabsModule, RouterLink, RouterLinkActive, LogoComponent, LogoutButtonComponent],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  // 3. Restaura a lista completa de links de navegação
  navLinks = [
    { path: 'dashboard', label: 'Dashboard' },
    { path: 'relatorios', label: 'Relatório Diário' },
    { path: 'historico-relatorios', label: 'Histórico' },
  ];
}