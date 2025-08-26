import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

import { SingleReportData } from '../../modal/single-report-data/single-report-data'; 
import { ReportDataService } from '../../services/report-data'; 

// Interface para guardar os KPIs calculados
interface CalculatedKPIs {
  mediaTem2C: number;
  mediaQ90h: number;
  mediaConz1Nivel: number;
  mediaConz2Nivel: number;
  mediaPre1Amp: number;
  mediaPre2Amp: number;
  mediaPre3Amp: number;
  mediaPre4Amp: number;
}

// Interface para guardar os resultados da comparação
interface ComparisonResult {
  metricName: string;
  value1: number;
  value2: number;
  difference: number;
  unit: string;
}

@Component({
  selector: 'app-comparison-report',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatIconModule
  ],
  templateUrl: './comparison-report.html',
  styleUrl: './comparison-report.css',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
})
export class ComparisonReportComponent {
  
  public startDate1: Date | null = null;
  public endDate1: Date | null = null;
  public startDate2: Date | null = null;
  public endDate2: Date | null = null;
  public isLoading: boolean = false;
  public results: ComparisonResult[] = [];
  public comparisonDone: boolean = false;

  constructor(private reportService: ReportDataService) {}

  compararPeriodos(): void {
    if (!this.startDate1 || !this.endDate1 || !this.startDate2 || !this.endDate2) {
      alert('Por favor, selecione os dois períodos para comparação.');
      return;
    }

    this.isLoading = true;
    this.comparisonDone = true;

    forkJoin({
      periodo1: this.reportService.getReportsByDateRange(this.startDate1, this.endDate1),
      periodo2: this.reportService.getReportsByDateRange(this.startDate2, this.endDate2)
    }).subscribe(({ periodo1, periodo2 }) => {
      
      const kpisPeriodo1 = this.calculateKPIsForPeriod(periodo1);
      const kpisPeriodo2 = this.calculateKPIsForPeriod(periodo2);

      this.results = this.calculateComparison(kpisPeriodo1, kpisPeriodo2);
      
      this.isLoading = false;
    });
  }

  /**
   * ATUALIZADO: A função agora calcula a média para todas as métricas.
   */
  calculateKPIsForPeriod(reports: SingleReportData[]): CalculatedKPIs {
    const defaultKPIs = {
      mediaTem2C: 0, mediaQ90h: 0, mediaConz1Nivel: 0, mediaConz2Nivel: 0,
      mediaPre1Amp: 0, mediaPre2Amp: 0, mediaPre3Amp: 0, mediaPre4Amp: 0
    };

    if (!reports || reports.length === 0) {
      return defaultKPIs;
    }

    const calculateAverage = (metric: keyof SingleReportData): number => {
      const validReports = reports.filter(r => typeof r[metric] === 'number');
      if (validReports.length === 0) return 0;
      const total = validReports.reduce((acc, r) => acc + (r[metric] as number), 0);
      return total / validReports.length;
    };
    
    return {
      mediaTem2C: calculateAverage('tem2C'),
      mediaQ90h: calculateAverage('q90h'),
      mediaConz1Nivel: calculateAverage('conz1Nivel'),
      mediaConz2Nivel: calculateAverage('conz2Nivel'),
      mediaPre1Amp: calculateAverage('pre1Amp'),
      mediaPre2Amp: calculateAverage('pre2Amp'),
      mediaPre3Amp: calculateAverage('pre3Amp'),
      mediaPre4Amp: calculateAverage('pre4Amp'),
    };
  }

  calculateComparison(kpis1: CalculatedKPIs, kpis2: CalculatedKPIs): ComparisonResult[] {
    const compare = (metricName: string, value1: number, value2: number, unit: string): ComparisonResult => {
      let difference = 0;
      if (value1 !== 0) {
        difference = ((value2 - value1) / value1) * 100;
      } else if (value2 > 0) {
        difference = 100;
      }
      return { metricName, value1, value2, difference, unit };
    };

    return [
      compare('Média de Temperatura', kpis1.mediaTem2C, kpis2.mediaTem2C, '°C'),
      compare('Média de Eficiência', kpis1.mediaQ90h, kpis2.mediaQ90h, '%'),
      compare('Média Nível Conz1', kpis1.mediaConz1Nivel, kpis2.mediaConz1Nivel, ''),
      compare('Média Nível Conz2', kpis1.mediaConz2Nivel, kpis2.mediaConz2Nivel, ''),
      compare('Média Amp Pre1', kpis1.mediaPre1Amp, kpis2.mediaPre1Amp, 'A'),
      compare('Média Amp Pre2', kpis1.mediaPre2Amp, kpis2.mediaPre2Amp, 'A'),
      compare('Média Amp Pre3', kpis1.mediaPre3Amp, kpis2.mediaPre3Amp, 'A'),
      compare('Média Amp Pre4', kpis1.mediaPre4Amp, kpis2.mediaPre4Amp, 'A'),
    ];
  }
}
