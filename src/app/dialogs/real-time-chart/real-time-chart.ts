// Ficheiro: src/app/dialogs/real-time-chart/real-time-chart.component.ts
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { ReportDataService } from '../../services/report-data';

@Component({
  selector: 'app-real-time-chart',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, BaseChartDirective],
  templateUrl: './real-time-chart.html',
  styleUrl: './real-time-chart.css'
})
export class RealTimeChartComponent implements OnInit, OnDestroy {
  // @ViewChild permite-nos aceder ao elemento do gráfico no HTML
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private dataSubscription!: Subscription;
  public lineChartData: ChartConfiguration['data'];
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: { duration: 0 }, // Desliga a animação para melhor performance em tempo real
    scales: { y: { beginAtZero: true, suggestedMax: 40 } }
  };

  // Injetamos o MAT_DIALOG_DATA para receber o nome da máquina
  constructor(
    private reportService: ReportDataService,
    @Inject(MAT_DIALOG_DATA) public data: { machineName: string }
  ) {
    // Inicializamos a estrutura de dados do gráfico
    this.lineChartData = {
      labels: [],
      datasets: [{
        data: [],
        label: `Corrente (Amp) - ${this.data.machineName}`,
        borderColor: '#005a9c',
        backgroundColor: 'rgba(0, 90, 156, 0.2)',
        fill: true
      }]
    };
  }

  ngOnInit(): void {
    // Subscrevemos ao fluxo de dados em tempo real
    this.dataSubscription = this.reportService.getRealTimeCurrentData().subscribe(newValue => {
      const now = new Date();
      const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      // Adiciona o novo dado e o novo rótulo (timestamp)
      this.lineChartData.labels?.push(timestamp);
      this.lineChartData.datasets[0].data.push(newValue);

      // Limita o gráfico a mostrar apenas os últimos 20 pontos de dados
      if (this.lineChartData.labels && this.lineChartData.labels.length > 20) {
        this.lineChartData.labels.shift();
        this.lineChartData.datasets[0].data.shift();
      }

      // Atualiza o gráfico para desenhar o novo ponto
      this.chart?.update();
    });
  }

  // ngOnDestroy é crucial para evitar fugas de memória
  ngOnDestroy(): void {
    // Cancela a subscrição quando o componente é destruído (o modal é fechado)
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
