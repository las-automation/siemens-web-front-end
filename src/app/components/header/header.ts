// Ficheiro: src/app/components/header/header.component.ts
import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs'; // Importa o módulo de abas
import { RouterLink, RouterLinkActive } from '@angular/router'; // Importa as ferramentas de roteamento

@Component({
  selector: 'app-header',
  standalone: true,
  // Adiciona os novos módulos aos imports
  imports: [CommonModule, NgOptimizedImage, MatTabsModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  // Criamos um array para os nossos links de navegação.
  // Isto torna o nosso HTML mais limpo e fácil de manter.
  navLinks = [
    { path: 'dashboard', label: 'Dashboard' },
    { path: 'relatorios', label: 'Relatório Diário' }, // Cambiamos o nome para maior claridade
    { path: 'historico-relatorios', label: 'Histórico' }
  ];
}