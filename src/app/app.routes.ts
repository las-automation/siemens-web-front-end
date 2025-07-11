// Ficheiro: src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';

export const routes: Routes = [
    // Se o utilizador não especificar nenhum caminho, redireciona para '/dashboard'
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    // Quando o caminho for '/dashboard', carrega o DashboardComponent
    { path: 'dashboard', component: DashboardComponent }
];
