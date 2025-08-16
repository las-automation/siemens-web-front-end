import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Importamos a nova interface
import { SingleReportData } from '../../modal/single-report-data/single-report-data';

@Component({
  selector: 'app-machines-report',
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule ],
  standalone: true,
  templateUrl: './machines-report.html',
  styleUrl: './machines-report.css'
})
export class MachinesReport {

  // O Input agora espera um único objeto, que pode ser nulo
  @Input() reportData: SingleReportData | null = null;
  @Output() viewChartClicked = new EventEmitter<SingleReportData>();

  // As colunas agora devem corresponder aos nomes da nova interface
  displayedColumns: string[] = [
    'data_hora',
    'conz1_nivel', 
    'conz2_nivel', 
    'tem2_c', 
    'pre1_amp',
    'pre2_amp',
    'pre3_amp',
    'pre4_amp',
    'q90h',
    'usuario',
    // 'grafico' // Coluna de ações
  ];

  constructor() {}

  // Este método pode não ser mais necessário se não houver "dias" na nova estrutura
  getManutencaoStatus(dias: number): string {
    if (dias <= 15) return 'alarme';
    if (dias <= 45) return 'atencao';
    return 'normal';
  }

  onAbrirGrafico(machineData: SingleReportData): void {
    this.viewChartClicked.emit(machineData);
  }
}
