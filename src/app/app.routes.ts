import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { DailyReportComponent } from './pages/daily-report/daily-report';
import { ReportHistoryComponent } from './pages/report-history/report-history'; // Importe aquí
// ... outros imports de páxina ...

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'relatorios', component: DailyReportComponent },
    { path: 'historico-relatorios', component: ReportHistoryComponent } // Engada esta liña
    // ... outras rutas ...
];
