import { Routes } from '@angular/router';
// 1. Importe o seu AuthGuard
import { authGuard } from './auth-guard';
import { LoginComponent } from './pages/login/login';
import { DailyReportComponent } from './pages/daily-report/daily-report';

export const routes: Routes = [
  // A rota de login não precisa de proteção
  { 
    path: 'login', 
    component: LoginComponent 
  },
  // A rota de relatórios AGORA está protegida pelo AuthGuard
  { 
    path: 'relatorios', 
    component: DailyReportComponent,
    canActivate: [authGuard] // 2. Adicione esta linha para ativar o "guarda"
  },
  // Rota padrão para redirecionar para o login ou para os relatórios
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  // Rota "catch-all" para qualquer outro endereço
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];