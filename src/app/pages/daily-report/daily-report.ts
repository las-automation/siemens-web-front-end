// Ficheiro: src/app/pages/daily-report/daily-report.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips'; // 1. Importa o módulo de "chips"
import { ReportDataService, DailyReportData } from '../../services/report-data';
import { MatDialog } from '@angular/material/dialog';
import { RealTimeChartComponent } from '../../dialogs/real-time-chart/real-time-chart';
import { SaveButtonComponent } from '../../components/save-button/save-button';


@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule,  SaveButtonComponent, MatChipsModule],
  templateUrl: './daily-report.html',
  styleUrl: './daily-report.css'
})
export class DailyReportComponent implements OnInit {

  reportData: DailyReportData[] = [];
  maquinaMaisTrabalhadora: DailyReportData | undefined;
  consumoTotalCorrente = 0;
  eficienciaMedia = 0;

 displayedColumns: string[] = ['nomeMaquina', 'status', 'corrente', 'consumoCorrente', 'temperatura', 'nivel', 'horasTrabalhadas', 'horasInativas', 'diasTrabalhados', 'proximaManutencao', 'acoes'];


  constructor(private reportService: ReportDataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    // CORREÇÃO: Adicionamos o tipo explícito 'DailyReportData[]' ao parâmetro 'data'.
    this.reportService.getDailyReport().subscribe((data: DailyReportData[]) => {
      this.reportData = data;
      this.calcularKPIs();
    });
  }

  calcularKPIs(): void {
    if (this.reportData.length === 0) return;

    // CORREÇÃO: Adicionamos os tipos explícitos aos parâmetros da função reduce
    this.maquinaMaisTrabalhadora = this.reportData.reduce((prev: DailyReportData, current: DailyReportData) => 
      (prev.horasTrabalhadas > current.horasTrabalhadas) ? prev : current
    );

    this.consumoTotalCorrente = this.reportData.reduce((acc: number, item: DailyReportData) => acc + item.consumoCorrente, 0);

    this.eficienciaMedia = this.reportData.reduce((acc: number, item: DailyReportData) => acc + item.eficiencia, 0) / this.reportData.length;
  }

  // Método para definir a cor do "chip" de status
  getStatusColor(status: string): string {
    switch (status) {
      case 'Operando': return 'primary';
      case 'Inativo': return 'accent';
      case 'Manutenção': return 'warn';
      default: return '';
    }
  }

  getManutencaoStatus(dias: number): string {
    if (dias <= 15) return 'alarme';
    if (dias <= 45) return 'atencao';
    return 'normal';
  }

  abrirGrafico(nomeMaquina: string): void {
    this.dialog.open(RealTimeChartComponent, {
      width: '800px',
      data: { machineName: nomeMaquina } // Passa o nome da máquina para o diálogo
    });
  }
}
