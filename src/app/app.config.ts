// src/app/app.config.ts

import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideHttpClient, withFetch } from '@angular/common/http'; 
// 1. ALTERE ESTA LINHA: remova o '/async' do final
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), // <-- REMOVI A LINHA DUPLICADA
    provideAnimations(),   // 2. ALTERE ESTA LINHA: remova o 'Async' do nome
    provideHttpClient(withFetch()),
  ]
};