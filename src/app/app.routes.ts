// Ficheiro: src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { DailyReportComponent } from './pages/daily-report/daily-report'; // Importe aqui
// ... outros imports de página ...

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    // ... outras rotas ...
    { path: 'relatorios', component: DailyReportComponent } // Adicione esta linha
];