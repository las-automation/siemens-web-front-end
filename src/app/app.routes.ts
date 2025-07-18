import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { DailyReportComponent } from './pages/daily-report/daily-report';
import { ReportHistoryComponent } from './pages/report-history/report-history'; // Importe aquí
import { LoginComponent } from './pages/login/login';
import { authGuard } from './auth-guard'; // Importa o nosso guarda

export const routes: Routes = [
      // A página de login é pública
  // A página de login é pública
  { path: 'login', component: LoginComponent },

  // Todas as outras páginas são protegidas pelo authGuard
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'relatorios', component: DailyReportComponent, canActivate: [authGuard] },
  { path: 'historico-relatorios', component: ReportHistoryComponent, canActivate: [authGuard] },

  // Se o utilizador tentar aceder a qualquer outra coisa, é redirecionado para o login
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
