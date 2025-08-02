import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DailyReportData } from '../../modal/daily-report-data/daily-report-data'; 
import { ReportDataService } from '../../services/report-data';
import { MatDialog } from '@angular/material/dialog';
import { RealTimeChartComponent } from '../../dialogs/real-time-chart/real-time-chart';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-machines-report',
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule ],
  standalone: true,
  templateUrl: './machines-report.html',
  styleUrl: './machines-report.css'
})
export class MachinesReport {

  @Input() reportData: DailyReportData[] = [];
  @Output() viewChartClicked = new EventEmitter<DailyReportData>();

  // ATUALIZAÇÃO: Adicionamos todas as colunas que vêm da API
  displayedColumns: string[] = [
    'nomeMaquina', 
    'status', 
    'corrente', 
    'temperatura', 
    'nivel', 
    'horasTrabalhadas', 
    'horasInativas', 
    'diasTrabalhados', 
    'eficiencia', 
    'proximaManutencao', 
    'grafico'
  ];

  constructor() {}

  getManutencaoStatus(dias: number): string {
    if (dias <= 15) return 'alarme';
    if (dias <= 45) return 'atencao';
    return 'normal';
  }

  onAbrirGrafico(machineData: DailyReportData): void {
    console.log('Botão clicado no componente filho! A emitir evento...');
    // 3. Use o emissor para "disparar" o evento para o pai, enviando os dados da máquina
    this.viewChartClicked.emit(machineData);
  }
}
