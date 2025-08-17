import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { SingleReportData } from '../../modal/single-report-data/single-report-data'; 
import { ReportDataService } from '../../services/report-data'; 

@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatIconModule, 
    MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule,
    MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './daily-report.html',
  styleUrl: './daily-report.css'
})
export class DailyReportComponent implements OnInit {
  
  private allReports: SingleReportData[] = [];
  public dadosExibidos: SingleReportData[] = [];
  public isLoading: boolean = true;

  public startDate: Date | null = null;
  public endDate: Date | null = null;
  
  consumoTotalCorrente = 0;
  eficienciaMedia = 0;
  alertasNoDia = 0;

  displayedColumns: string[] = [
    'reportId', 'dataHora', 'usuario', 'tem2C', 'q90h', 
    'conz1Nivel', 'conz2Nivel', 'pre1Amp', 'pre2Amp', 
    'pre3Amp', 'pre4Amp', 'excelId'
  ];

  constructor(private reportService: ReportDataService) {}

    ngOnInit(): void {
    // Usamos um setTimeout como uma solução simples para esperar que o token seja guardado.
    // Uma solução mais avançada usaria um serviço de autenticação com Observables.
    setTimeout(() => {
      this.reportService.loadAllReports().subscribe({
        next: (reports) => {
          const sortedReports = reports.sort((a, b) => {
            const dateA = this.formatarData(a.dataHora)?.getTime() || 0;
            const dateB = this.formatarData(b.dataHora)?.getTime() || 0;
            return dateB - dateA;
          });

          this.allReports = sortedReports;
          this.dadosExibidos = this.allReports;
          this.calcularKPIs(this.dadosExibidos);
          this.isLoading = false;
          console.log('Dados carregados e ORDENADOS com sucesso:', this.allReports);
        },
        error: (err) => {
          console.error('Falha ao carregar os relatórios no componente:', err);
          this.isLoading = false; // Garante que a mensagem de "loading" desapareça mesmo com erro.
        }
      });
    }, 500); // Espera 500 milissegundos
  }

  filtrarRelatorios(): void {
    if (!this.startDate || !this.endDate) {
      alert('Por favor, selecione as datas de início e fim.');
      return;
    }
    
    this.reportService.getReportsByDateRange(this.startDate, this.endDate)
      .subscribe(dados => {
        this.dadosExibidos = dados;
        this.calcularKPIs(this.dadosExibidos);
      });
  }

  limparFiltro(): void {
    this.startDate = null;
    this.endDate = null;
    this.dadosExibidos = this.allReports;
    this.calcularKPIs(this.dadosExibidos);
  }

  calcularKPIs(reports: SingleReportData[]): void {
    if (!reports || reports.length === 0) {
      this.consumoTotalCorrente = 0;
      this.eficienciaMedia = 0;
      this.alertasNoDia = 0;
      return;
    }

    const reportsComEficiencia = reports.filter(r => typeof r.q90h === 'number');
    const totalReportsComEficiencia = reportsComEficiencia.length;

    this.consumoTotalCorrente = reports.reduce((acc, report) => acc + this.calcularConsumoReport(report), 0);
    const totalEficiencia = reportsComEficiencia.reduce((acc, report) => acc + (report.q90h || 0), 0);
    
    this.eficienciaMedia = totalReportsComEficiencia > 0 ? totalEficiencia / totalReportsComEficiencia : 0;
    this.alertasNoDia = reports.filter(report => (report.tem2C || 0) > 90.0).length;
  }

  public formatarData(dataArray: number[]): Date | null {
    if (!dataArray || dataArray.length < 6) return null;
    return new Date(dataArray[0], dataArray[1] - 1, dataArray[2], dataArray[3], dataArray[4], dataArray[5]);
  }

  public calcularConsumoReport(report: SingleReportData): number {
    return (report.pre1Amp || 0) + (report.pre2Amp || 0) + (report.pre3Amp || 0) + (report.pre4Amp || 0);
  }
}
