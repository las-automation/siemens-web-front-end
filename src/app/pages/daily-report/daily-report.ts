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
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
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
  styleUrl: './daily-report.css',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
})
export class DailyReportComponent implements OnInit {
  
  private allReports: SingleReportData[] = [];
  public dadosExibidos: SingleReportData[] = [];
  public isLoading: boolean = true;
  public searchPerformed: boolean = false;

  public startDate: Date | null = null;
  public endDate: Date | null = null;
  
  // NOVAS PROPRIEDADES PARA OS KPIs
  mediaTem2C = 0;
  mediaQ90h = 0;
  mediaConz1Nivel = 0;
  mediaConz2Nivel = 0;
  mediaPre1Amp = 0;
  mediaPre2Amp = 0;
  mediaPre3Amp = 0;
  mediaPre4Amp = 0;

  displayedColumns: string[] = [
    'reportId', 'dataHora', 'usuario', 'tem2C', 'q90h', 
    'conz1Nivel', 'conz2Nivel', 'pre1Amp', 'pre2Amp', 
    'pre3Amp', 'pre4Amp', 'excelId'
  ];

  constructor(private reportService: ReportDataService) {}

  ngOnInit(): void {
    this.reportService.loadAllReports().subscribe({
      next: (reports) => {
        this.allReports = reports.sort((a, b) => b.excelId - a.excelId);
        this.isLoading = false;
        this.calcularKPIs([]);
      },
      error: (err) => {
        console.error("Erro ao carregar dados iniciais:", err);
        this.isLoading = false;
      }
    });
  }

  filtrarRelatorios(): void {
    if (!this.startDate || !this.endDate) {
      alert('Por favor, selecione as datas de início e fim.');
      return;
    }
    
    this.searchPerformed = true;
    
    this.reportService.getReportsByDateRange(this.startDate, this.endDate)
      .subscribe(dados => {
        this.dadosExibidos = dados;
        this.calcularKPIs(this.dadosExibidos);
      });
  }

  limparFiltro(): void {
    this.startDate = null;
    this.endDate = null;
    this.dadosExibidos = [];
    this.searchPerformed = false;
    this.calcularKPIs([]);
  }

  /**
   * ATUALIZADO: A lógica agora calcula a média de cada métrica individualmente.
   */
  calcularKPIs(reports: SingleReportData[]): void {
    const resetKPIs = () => {
      this.mediaTem2C = 0;
      this.mediaQ90h = 0;
      this.mediaConz1Nivel = 0;
      this.mediaConz2Nivel = 0;
      this.mediaPre1Amp = 0;
      this.mediaPre2Amp = 0;
      this.mediaPre3Amp = 0;
      this.mediaPre4Amp = 0;
    };

    if (!reports || reports.length === 0) {
      resetKPIs();
      return;
    }

    const reportsByDay = new Map<string, SingleReportData[]>();
    reports.forEach(report => {
      const reportDate = this.formatarData(report.dataHora);
      if (reportDate) {
        const dayKey = reportDate.toISOString().split('T')[0];
        if (!reportsByDay.has(dayKey)) {
          reportsByDay.set(dayKey, []);
        }
        reportsByDay.get(dayKey)?.push(report);
      }
    });

    const dailyAverages: { [key: string]: number[] } = {
      tem2C: [], q90h: [], conz1Nivel: [], conz2Nivel: [],
      pre1Amp: [], pre2Amp: [], pre3Amp: [], pre4Amp: []
    };

    const metrics: (keyof SingleReportData)[] = ['tem2C', 'q90h', 'conz1Nivel', 'conz2Nivel', 'pre1Amp', 'pre2Amp', 'pre3Amp', 'pre4Amp'];

    reportsByDay.forEach(dailyReports => {
      metrics.forEach(metric => {
        const validReports = dailyReports.filter(r => typeof r[metric] === 'number');
        if (validReports.length > 0) {
          const total = validReports.reduce((acc, r) => acc + (r[metric] as number || 0), 0);
          dailyAverages[metric].push(total / validReports.length);
        }
      });
    });

    const calculateFinalAverage = (dailyValues: number[]) => {
      if (dailyValues.length === 0) return 0;
      const total = dailyValues.reduce((acc, val) => acc + val, 0);
      return total / dailyValues.length;
    };

    // CORRIGIDO: Acesso às propriedades com bracket notation ['...']
    this.mediaTem2C = calculateFinalAverage(dailyAverages['tem2C']);
    this.mediaQ90h = calculateFinalAverage(dailyAverages['q90h']);
    this.mediaConz1Nivel = calculateFinalAverage(dailyAverages['conz1Nivel']);
    this.mediaConz2Nivel = calculateFinalAverage(dailyAverages['conz2Nivel']);
    this.mediaPre1Amp = calculateFinalAverage(dailyAverages['pre1Amp']);
    this.mediaPre2Amp = calculateFinalAverage(dailyAverages['pre2Amp']);
    this.mediaPre3Amp = calculateFinalAverage(dailyAverages['pre3Amp']);
    this.mediaPre4Amp = calculateFinalAverage(dailyAverages['pre4Amp']);
  }

  public formatarData(dataArray: number[]): Date | null {
    if (!dataArray || dataArray.length < 6) return null;
    return new Date(dataArray[0], dataArray[1] - 1, dataArray[2], dataArray[3], dataArray[4], dataArray[5]);
  }
}
