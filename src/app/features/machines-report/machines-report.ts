import { Component,  OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ReportDataService, DailyReportData } from '../../services/report-data';
import { MatDialog } from '@angular/material/dialog';
import { RealTimeChartComponent } from '../../dialogs/real-time-chart/real-time-chart';

@Component({
  selector: 'app-machines-report',
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule],
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
    this.viewChartClicked.emit(machineData);
  }
}
