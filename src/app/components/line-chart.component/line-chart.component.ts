import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './line-chart.component.html',
})
export class LineChartComponent {
  // CORREÇÃO: Adicionamos as propriedades @Input que faltavam.
  // Elas são as "portas de entrada" para os dados virem do componente pai.
  @Input() lineChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  @Input() lineChartOptions: ChartConfiguration['options'] = { responsive: true };
}