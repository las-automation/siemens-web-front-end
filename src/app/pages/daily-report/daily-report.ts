import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Adicionado ReactiveFormsModule
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker'; // NOVO
import { MatNativeDateModule } from '@angular/material/core';      // NOVO

import { SingleReportData } from '../../modal/single-report-data/single-report-data'; 
import { ReportDataService } from '../../services/report-data'; 
import { MachinesReport } from "../../features/machines-report/machines-report";

@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, 
    MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule,
    MatDatepickerModule, MatNativeDateModule, MachinesReport
  ],
  templateUrl: './daily-report.html',
  styleUrl: './daily-report.css'
})
export class DailyReportComponent implements OnInit {
  
  latestReport: SingleReportData | null = null;
  relatoriosFiltrados: SingleReportData[] = [];
  modoFiltro: boolean = false;
  isLoading: boolean = true; // Começa como true até os dados iniciais serem carregados

  // Propriedades para o seletor de datas
  public startDate: Date | null = null;
  public endDate: Date | null = null;
  
  // KPIs
  consumoTotalCorrente = 0;
  eficienciaMedia = 0;
  alertasNoDia = 0;

  constructor(private reportService: ReportDataService) {}

  ngOnInit(): void {
    // Carrega todos os relatórios uma única vez
    this.reportService.loadAllReports().subscribe(() => {
      this.isLoading = false;
      // Depois de carregar, pega o mais recente para a exibição inicial
      this.reportService.getLatestReport().subscribe(latest => {
        this.latestReport = latest;
        this.calcularKPIs();
      });
    });
  }

  filtrarRelatorios(): void {
    if (!this.startDate || !this.endDate) {
      alert('Por favor, selecione as datas de início e fim.');
      return;
    }

    this.isLoading = true;
    this.modoFiltro = true;
    
    this.reportService.getReportsByDateRange(this.startDate, this.endDate)
      .subscribe(dados => {
        this.relatoriosFiltrados = dados;
        this.isLoading = false;
        this.calcularKPIs();
        console.log('Dados filtrados (do cache):', dados);
      });
  }

  limparFiltro(): void {
    this.modoFiltro = false;
    this.startDate = null;
    this.endDate = null;
    this.relatoriosFiltrados = [];
    this.calcularKPIs(); // Recalcula os KPIs para o modo de tempo real
  }

  calcularKPIs(): void {
    // ... sua lógica de KPIs (que já funciona para ambos os modos) ...
  }

  public formatarData(dataArray: number[]): Date | null {
    if (!dataArray || dataArray.length < 6) return null;
    return new Date(dataArray[0], dataArray[1] - 1, dataArray[2], dataArray[3], dataArray[4], dataArray[5]);
  }
}
