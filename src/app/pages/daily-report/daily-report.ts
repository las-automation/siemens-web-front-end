import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Importamos a NOVA interface
import { SingleReportData } from '../../modal/single-report-data/single-report-data'; 
import { ReportDataService } from '../../services/report-data'; 

// Importamos o componente da tabela
import { MachinesReport } from "../../features/machines-report/machines-report";
import { SaveButtonComponent } from '../../components/save-button/save-button';
// O RealTimeChartComponent pode precisar de ajustes dependendo do que ele espera receber
// import { RealTimeChartComponent } from '../../dialogs/real-time-chart/real-time-chart';

@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MachinesReport, // Nosso componente de tabela
    SaveButtonComponent,
  ],
  templateUrl: './daily-report.html',
  styleUrl: './daily-report.css'
})
export class DailyReportComponent implements OnInit, OnDestroy {

  // Agora temos um único objeto, que pode ser nulo antes de carregar
  latestReport: SingleReportData | null = null;
  
  // Os KPIs podem ser calculados diretamente a partir do latestReport
  consumoTotalCorrente = 0;
  eficienciaMedia = 0;
  alertasNoDia = 0;

  private dataSubscription!: Subscription;

  constructor(
    private reportService: ReportDataService, 
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.dataSubscription = interval(2000) // Aumentei o intervalo para 2s
      .pipe(
        // A cada 2 segundos, busca o último relatório
        switchMap(() => this.reportService.getLatestReport())
      )
      .subscribe(data => {
        console.log('Último relatório recebido!', data);
        this.latestReport = data;
        this.calcularKPIs(); // Recalcula os KPIs com os novos dados
      });
  }

  calcularKPIs(): void {
    if (!this.latestReport) {
      return; // Se não há dados, não faz nada
    }
    // Lógica de cálculo de KPIs baseada em UM único relatório
    // Exemplo:
    this.consumoTotalCorrente = this.latestReport.pre1_amp + this.latestReport.pre2_amp + this.latestReport.pre3_amp + this.latestReport.pre4_amp;
    this.eficienciaMedia = this.latestReport.q90h; // Supondo que q90h seja a eficiência
    
    // Lógica de alertas
    const temperaturaElevada = this.latestReport.tem2_c > 90.0;
    this.alertasNoDia = temperaturaElevada ? 1 : 0;
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  abrirGrafico(report: SingleReportData): void {
    console.log('Abrir gráfico para:', report);
    // A lógica do modal pode precisar ser ajustada para receber um SingleReportData
  }
}
