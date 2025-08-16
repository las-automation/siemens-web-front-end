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

  // ATUALIZADO: Adicionadas todas as colunas do seu modal
  displayedColumns: string[] = [
    'report_id', 'data_hora', 'usuario', 'tem2_c', 'q90h', 
    'conz1_nivel', 'conz2_nivel', 'pre1_amp', 'pre2_amp', 
    'pre3_amp', 'pre4_amp', 'excel_id'
  ];

  constructor(private reportService: ReportDataService) {}

  ngOnInit(): void {
    this.reportService.loadAllReports().subscribe(reports => {
      this.allReports = reports;
      this.dadosExibidos = this.allReports;
      this.calcularKPIs(this.dadosExibidos);
      this.isLoading = false;
    });
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

  /**
   * CORRIGIDO: A função agora é mais segura contra valores nulos ou indefinidos.
   */
  calcularKPIs(reports: SingleReportData[]): void {
    if (!reports || reports.length === 0) {
      this.consumoTotalCorrente = 0;
      this.eficienciaMedia = 0;
      this.alertasNoDia = 0;
      return;
    }

    const totalReports = reports.length;
    
    this.consumoTotalCorrente = reports.reduce((acc, report) => acc + this.calcularConsumoReport(report), 0);
    const totalEficiencia = reports.reduce((acc, report) => acc + (report.q90h || 0), 0);
    // Evita divisão por zero
    this.eficienciaMedia = totalReports > 0 ? totalEficiencia / totalReports : 0;
    this.alertasNoDia = reports.filter(report => (report.tem2_c || 0) > 90.0).length;
  }

  public formatarData(dataArray: number[]): Date | null {
    if (!dataArray || dataArray.length < 6) return null;
    return new Date(dataArray[0], dataArray[1] - 1, dataArray[2], dataArray[3], dataArray[4], dataArray[5]);
  }

  public calcularConsumoReport(report: SingleReportData): number {
    return (report.pre1_amp || 0) + (report.pre2_amp || 0) + (report.pre3_amp || 0) + (report.pre4_amp || 0);
  }
}
