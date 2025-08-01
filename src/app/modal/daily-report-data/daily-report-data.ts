import { Component } from '@angular/core';

@Component({
  selector: 'app-daily-report-data',
  imports: [],
  templateUrl: './daily-report-data.html',
  styleUrl: './daily-report-data.css'
})
export class DailyReportData {

}
export interface DailyReportData {
  reportId: number;

  nomeMaquina: string;
  horasTrabalhadas: number;
  horasInativas: number;
  corrente: number;
  eficiencia: number;
  nivel: number;
  temperatura: number;
  status: string;
  diasTrabalhados: number;
  proximaManutencao: number;

  consumoCorrente: number;
}
