import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
import { LoginComponent } from './pages/login/login';
import { DailyReportComponent } from './pages/daily-report/daily-report';
// 1. Importe o novo componente
import { ComparisonReportComponent } from './pages/comparison-report/comparison-report';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'relatorios', 
    component: DailyReportComponent,
    canActivate: [authGuard]
  },
  // 2. Adicione a nova rota de comparação
  {
    path: 'comparacao',
    component: ComparisonReportComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
