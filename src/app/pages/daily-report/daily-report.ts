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
// O componente MachinesReport não é mais necessário aqui, pois vamos usar uma tabela local
// import { MachinesReport } from "../../features/machines-report/machines-report";

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
  
  // 1. Nova propriedade para guardar TODOS os relatórios do cache
  private allReports: SingleReportData[] = [];
  // 2. Nova propriedade para os dados que são efetivamente exibidos na tabela
  public dadosExibidos: SingleReportData[] = [];
  
  public isLoading: boolean = true;

  // Propriedades para o seletor de datas
  public startDate: Date | null = null;
  public endDate: Date | null = null;
  
  // KPIs
  consumoTotalCorrente = 0;
  eficienciaMedia = 0;
  alertasNoDia = 0;

  // Colunas da tabela
  displayedColumns: string[] = ['data_hora', 'usuario', 'tem2_c', 'q90h', 'consumo_total'];

  constructor(private reportService: ReportDataService) {}

  ngOnInit(): void {
    this.reportService.loadAllReports().subscribe(reports => {
      this.allReports = reports;
      this.dadosExibidos = this.allReports; // Exibe todos os dados inicialmente
      this.calcularKPIs(this.dadosExibidos); // Calcula os KPIs para todos os dados
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
        this.dadosExibidos = dados; // Atualiza a tabela com os dados filtrados
        this.calcularKPIs(this.dadosExibidos); // Recalcula os KPIs para os dados filtrados
      });
  }

  limparFiltro(): void {
    this.startDate = null;
    this.endDate = null;
    this.dadosExibidos = this.allReports; // Volta a exibir todos os dados
    this.calcularKPIs(this.dadosExibidos); // Recalcula os KPIs para todos os dados
  }

  /**
   * ATUALIZADO: A função agora recebe a lista de dados para calcular.
   * Isso a torna mais robusta e corrige os erros de 'toFixed'.
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
    this.eficienciaMedia = totalEficiencia / totalReports;
    this.alertasNoDia = reports.filter(report => report.tem2_c > 90.0).length;
  }

  public formatarData(dataArray: number[]): Date | null {
    if (!dataArray || dataArray.length < 6) return null;
    return new Date(dataArray[0], dataArray[1] - 1, dataArray[2], dataArray[3], dataArray[4], dataArray[5]);
  }

  public calcularConsumoReport(report: SingleReportData): number {
    return (report.pre1_amp || 0) + (report.pre2_amp || 0) + (report.pre3_amp || 0) + (report.pre4_amp || 0);
  }
}