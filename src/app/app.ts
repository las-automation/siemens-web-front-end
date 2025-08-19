import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Importe o Router e os eventos de navegação
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header'; 
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'siemens-web-front-end';
  
  // 2. Crie uma propriedade para controlar a visibilidade do header
  showHeader: boolean = false;

  constructor(private router: Router) {
    // 3. "Ouve" as mudanças de rota
    this.router.events.pipe(
      // Filtra apenas pelos eventos que acontecem no FIM da navegação
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // 4. Verifica se a URL atual é a de login
      if (event.urlAfterRedirects === '/login') {
        this.showHeader = false; // Se for, esconde o header
      } else {
        this.showHeader = true; // Se não for, mostra o header
      }
    });
  }
}
