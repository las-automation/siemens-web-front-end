import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { ChartConfiguration } from 'chart.js';

// 1. Importamos a NOVA interface de dados
import { SingleReportData } from '../../modal/single-report-data/single-report-data';
import { RealTimeDataService } from '../../services/report-data-time.service';
import { LineChartComponent } from '../../components/line-chart.component/line-chart.component';

@Component({
  selector: 'app-real-time-chart',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, LineChartComponent],
  templateUrl: './real-time-chart.html',
})
export class RealTimeChartComponent implements OnInit, OnDestroy {

  public currentChartData!: ChartConfiguration['data'];
  public temperatureChartData!: ChartConfiguration['data'];
  
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: { duration: 0 },
    scales: { y: { beginAtZero: false } }
  };

  private currentSubscription!: Subscription;
  private tempSubscription!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<RealTimeChartComponent>,
    // 2. O dado injetado agora é do tipo SingleReportData (opcional, pois o serviço busca o último)
    @Inject(MAT_DIALOG_DATA) public initialReportData: { report: SingleReportData },
    private realTimeService: RealTimeDataService
  ) {
    this.initializeCharts();
  }

  initializeCharts(): void {
    this.currentChartData = {
      labels: [],
      datasets: [{
        data: [],
        label: `Corrente Total (A)`, // Label atualizado
        borderColor: '#005a9c',
        backgroundColor: 'rgba(0, 90, 156, 0.2)',
        fill: true
      }]
    };
    this.temperatureChartData = {
      labels: [],
      datasets: [{
        data: [],
        label: `Temperatura (°C)`,
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        fill: true
      }]
    };
  }

  ngOnInit(): void {
    // 3. CORREÇÃO: Chamamos o método SEM argumentos
    this.currentSubscription = this.realTimeService
      .getRealTimeCurrentData() // <--- Argumento removido
      .subscribe(value => {
        const dataArray = this.currentChartData.datasets[0].data as number[];
        const labelsArray = (this.currentChartData.labels || []) as string[];
        
        this.updateChartData(dataArray, labelsArray, value);
        this.currentChartData = { ...this.currentChartData };
      });

    // 4. CORREÇÃO: Chamamos o método SEM argumentos
    this.tempSubscription = this.realTimeService
      .getRealTimeTemperatureData() // <--- Argumento removido
      .subscribe(value => {
        const dataArray = this.temperatureChartData.datasets[0].data as number[];
        const labelsArray = (this.temperatureChartData.labels || []) as string[];
        
        this.updateChartData(dataArray, labelsArray, value);
        this.temperatureChartData = { ...this.temperatureChartData };
      });
  }

  updateChartData(data: number[], labels: string[], value: number): void {
    const now = new Date();
    const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    labels.push(timestamp);
    data.push(value);

    // Mantém o gráfico com no máximo 20 pontos de dados
    if (labels.length > 20) {
      labels.shift();
      data.shift();
    }
  }

  ngOnDestroy(): void {
    if (this.currentSubscription) this.currentSubscription.unsubscribe();
    if (this.tempSubscription) this.tempSubscription.unsubscribe();
  }

  fecharModal(): void {
    this.dialogRef.close();
  }
}
