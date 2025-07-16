import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// 1. Importa o Chart.js e os seus "registerables"
import { Chart, registerables } from 'chart.js';

// 2. Regista todos os elementos do Chart.js (linhas, barras, legendas, etc.)
Chart.register(...registerables);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
