// Ficheiro: src/app/services/report-data.ts
import { Injectable } from '@angular/core';
import { of, interval, map } from 'rxjs';

// ATUALIZAÇÃO: Adicionamos os novos campos à interface
export interface DailyReportData {
  nomeMaquina: string;
  horasTrabalhadas: number;
  consumoCorrente: number; // em kWh
  eficiencia: number; // em %
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
      { nomeMaquina: 'Prensa 01', horasTrabalhadas: 7.5, consumoCorrente: 152.3, eficiencia: 98.5, diasTrabalhados: 120, proximaManutencao: 10 },
      { nomeMaquina: 'Prensa 02', horasTrabalhadas: 8.1, consumoCorrente: 165.1, eficiencia: 99.1, diasTrabalhados: 35, proximaManutencao: 55 },
      { nomeMaquina: 'Prensa 03', horasTrabalhadas: 6.9, consumoCorrente: 140.0, eficiencia: 97.2, diasTrabalhados: 88, proximaManutencao: 2 },
      { nomeMaquina: 'Prensa 04', horasTrabalhadas: 7.8, consumoCorrente: 159.8, eficiencia: 98.8, diasTrabalhados: 15, proximaManutencao: 75 },
      { nomeMaquina: 'Prensa 05', horasTrabalhadas: 5.2, consumoCorrente: 110.5, eficiencia: 95.0, diasTrabalhados: 60, proximaManutencao: 30 },
      { nomeMaquina: 'Prensa 06', horasTrabalhadas: 8.5, consumoCorrente: 171.2, eficiencia: 99.3, diasTrabalhados: 95, proximaManutencao: 25 },
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