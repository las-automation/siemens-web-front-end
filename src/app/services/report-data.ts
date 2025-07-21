// Ficheiro: src/app/services/report-data.ts
import { Injectable } from '@angular/core';
import { of, interval, map } from 'rxjs';

// ATUALIZAÇÃO: Adicionamos os novos campos à interface
export interface DailyReportData {
  nomeMaquina: string;
  horasTrabalhadas: number;
  horasInativas: number;
  consumoCorrente: number; // em kWh
  corrente: number; // em Amp
  eficiencia: number; // em %
  nivel: number; // em %
  temperatura: number;
  status: 'Operando' | 'Inativo' | 'Manutenção';
  diasTrabalhados: number;
  proximaManutencao: number; // em dias
}

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
    // ATUALIZAÇÃO: Adicionamos os dados simulados para os novos campos
    const reportData: DailyReportData[] = [
      { nomeMaquina: 'Prensa 01', corrente: 152.3, temperatura: 85.1, nivel: 98, status: 'Operando', horasTrabalhadas: 7.5, horasInativas: 0.5, consumoCorrente: 120.5, eficiencia: 98.2, diasTrabalhados: 12, proximaManutencao: 45 },
      { nomeMaquina: 'Prensa 02', corrente: 165.1, temperatura: 91.5, nivel: 99, status: 'Operando', horasTrabalhadas: 8.1, horasInativas: 0.0, consumoCorrente: 130.2, eficiencia: 97.5, diasTrabalhados: 13, proximaManutencao: 17 },
      { nomeMaquina: 'Prensa 03', corrente: 0, temperatura: 40.2, nivel: 15, status: 'Inativo', horasTrabalhadas: 6.9, horasInativas: 1.2, consumoCorrente: 110.8, eficiencia: 99.1, diasTrabalhados: 11, proximaManutencao: 5 },
      { nomeMaquina: 'Prensa 04', corrente: 159.8, temperatura: 88.9, nivel: 97, status: 'Operando', horasTrabalhadas: 7.8, horasInativas: 0.3, consumoCorrente: 125.7, eficiencia: 96.8, diasTrabalhados: 14, proximaManutencao: 60 },
      { nomeMaquina: 'Prensa 05', corrente: 0, temperatura: 25.0, nivel: 0, status: 'Manutenção', horasTrabalhadas: 5.2, horasInativas: 2.9, consumoCorrente: 100.3, eficiencia: 95.4, diasTrabalhados: 10, proximaManutencao: 20 },
    ];
    return of(reportData);
  }

  getReportHistory() {
    const historyData: ReportHistory[] = [
      { id: '20250714', data: '14/07/2025', resumo: 'Eficiência média: 98.2%. 2 Alertas registados.' },
      { id: '20250713', data: '13/07/2025', resumo: 'Eficiência média: 97.5%. 1 Alarme crítico.' },
      { id: '20250712', data: '12/07/2025', resumo: 'Eficiência média: 99.1%. Operação normal.' },
      { id: '20250711', data: '11/07/2025', resumo: 'Eficiência média: 96.8%. Parada para manutenção.' },
    ];
    return of(historyData);
  }

  // NOVO MÉTODO: Simula um fluxo de dados em tempo real
  getRealTimeCurrentData() {
    // A cada 1500ms (1.5 segundos)...
    return interval(1500).pipe(
      // ...gera um novo número aleatório para a corrente.
      map(() => {
        // Simula uma corrente base de 20A com uma variação de +/- 5A
        return 20 + (Math.random() * 10 - 5);
      })
    );
  }
}