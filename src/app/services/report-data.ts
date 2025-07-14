// Ficheiro: src/app/services/report-data.ts
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

export interface DailyReportData {
  nomeMaquina: string;
  horasTrabalhadas: number;
  consumoCorrente: number;
  eficiencia: number;
  diasTrabalhados: number;
  proximaManutencao: number;
}

// CORREÇÃO: Definimos e exportamos a nova interface aqui.
export interface ReportHistory {
  id: string;
  data: string;
  resumo: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {

  constructor() { }

  getDailyReport() {
    const reportData: DailyReportData[] = [
      { nomeMaquina: 'Prensa 01', horasTrabalhadas: 7.5, consumoCorrente: 152.3, eficiencia: 98.5, diasTrabalhados: 120, proximaManutencao: 10 },
      { nomeMaquina: 'Prensa 02', horasTrabalhadas: 8.1, consumoCorrente: 165.1, eficiencia: 99.1, diasTrabalhados: 35, proximaManutencao: 55 },
      { nomeMaquina: 'Prensa 03', horasTrabalhadas: 6.9, consumoCorrente: 140.0, eficiencia: 97.2, diasTrabalhados: 88, proximaManutencao: 2 },
    ];
    return of(reportData);
  }

  // NOVO MÉTODO: Simula a obtenção de uma lista de relatórios históricos
  getReportHistory() {
    const historyData: ReportHistory[] = [
      { id: '20250714', data: '14/07/2025', resumo: 'Eficiência média: 98.2%. 2 Alertas registados.' },
      { id: '20250713', data: '13/07/2025', resumo: 'Eficiência média: 97.5%. 1 Alarme crítico.' },
      { id: '20250712', data: '12/07/2025', resumo: 'Eficiência média: 99.1%. Operação normal.' },
      { id: '20250711', data: '11/07/2025', resumo: 'Eficiência média: 96.8%. Parada para manutenção.' },
    ];
    return of(historyData);
  }
}