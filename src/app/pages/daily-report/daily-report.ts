import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table'; // Import para a tabela de filtro
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SingleReportData } from '../../modal/single-report-data/single-report-data'; 
import { ReportDataService } from '../../services/report-data'; 
import { MachinesReport } from "../../features/machines-report/machines-report";

@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule, 
    MatIconModule, 
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MachinesReport,
  ],
  templateUrl: './daily-report.html',
  styleUrl: './daily-report.css'
})
export class DailyReportComponent implements OnInit, OnDestroy {

  // Propriedades existentes
  latestReport: SingleReportData | null = null;
  consumoTotalCorrente = 0;
  eficienciaMedia = 0;
  alertasNoDia = 0;
  private dataSubscription!: Subscription;

  // --- NOVAS PROPRIEDADES PARA O FILTRO ---
  public dataInicio: string = '';
  public dataFim: string = '';
  public relatoriosFiltrados: SingleReportData[] = [];
  public modoFiltro: boolean = false;
  public isLoading: boolean = false;

  constructor(
    private reportService: ReportDataService, 
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.iniciarTempoReal();
  }

  iniciarTempoReal(): void {
    this.dataSubscription = interval(5000)
      .pipe(switchMap(() => this.reportService.getLatestReport()))
      .subscribe(data => {
        if (!this.modoFiltro) {
          this.latestReport = data;
          this.calcularKPIs();
        }
      });
  }

  // --- MÉTODOS PARA O FILTRO ---

  filtrarRelatorios(): void {
    if (!this.dataInicio || !this.dataFim) {
      alert('Por favor, selecione as datas de início e fim.');
      return;
    }

    if (this.dataSubscription) this.dataSubscription.unsubscribe();

    this.isLoading = true;
    this.modoFiltro = true;
    this.latestReport = null;

    const inicioFormatado = this.dataInicio.replace('T', ' ') + ':00';
    const fimFormatado = this.dataFim.replace('T', ' ') + ':00';

    this.reportService.getReportsByDateTimeRange(inicioFormatado, fimFormatado)
      .subscribe(dados => {
        this.relatoriosFiltrados = dados;
        this.isLoading = false;
        this.calcularKPIs(); // ATUALIZADO: Calcula os KPIs para os dados filtrados
        console.log('Dados filtrados recebidos:', dados);
      });
  }

  limparFiltro(): void {
    this.modoFiltro = false;
    this.relatoriosFiltrados = [];
    this.dataInicio = '';
    this.dataFim = '';
    this.calcularKPIs(); // ATUALIZADO: Zera os KPIs imediatamente
    this.iniciarTempoReal();
  }

  // --- MÉTODO DE CÁLCULO DE KPI ATUALIZADO ---

  calcularKPIs(): void {
    // Se estiver no modo de filtro e houver dados filtrados
    if (this.modoFiltro && this.relatoriosFiltrados.length > 0) {
      const totalReports = this.relatoriosFiltrados.length;

      // Soma o consumo de todos os relatórios no array
      this.consumoTotalCorrente = this.relatoriosFiltrados.reduce((acc, report) => {
        return acc + (report.pre1_amp || 0) + (report.pre2_amp || 0) + (report.pre3_amp || 0) + (report.pre4_amp || 0);
      }, 0);

      // Calcula a eficiência média
      const totalEficiencia = this.relatoriosFiltrados.reduce((acc, report) => acc + (report.q90h || 0), 0);
      this.eficienciaMedia = totalEficiencia / totalReports;

      // Conta o número de alertas
      this.alertasNoDia = this.relatoriosFiltrados.filter(report => report.tem2_c > 90.0).length;

    // Se estiver no modo de tempo real e houver um relatório
    } else if (!this.modoFiltro && this.latestReport) {
      this.consumoTotalCorrente = this.latestReport.pre1_amp + this.latestReport.pre2_amp + this.latestReport.pre3_amp + this.latestReport.pre4_amp;
      this.eficienciaMedia = this.latestReport.q90h;
      const temperaturaElevada = this.latestReport.tem2_c > 90.0;
      this.alertasNoDia = temperaturaElevada ? 1 : 0;
    
    // Se não houver dados em nenhum dos modos
    } else {
      this.consumoTotalCorrente = 0;
      this.eficienciaMedia = 0;
      this.alertasNoDia = 0;
    }
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
  }
}