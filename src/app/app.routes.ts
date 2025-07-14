import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LavagemBiodiesel } from './pages/lavagem-biodiesel/lavagem-biodiesel';
import { FlashBiodiesel } from './pages/flash-biodiesel/flash-biodiesel';
import { Secagem } from './pages/secagem/secagem';
import { Glicerolise } from './pages/glicerolise/glicerolise';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'lavagem-biodiesel', component: LavagemBiodiesel },
    { path: 'flash-biodiesel', component: FlashBiodiesel },
    { path: 'secagem', component: Secagem },
    { path: 'glicerolise', component: Glicerolise },
];
