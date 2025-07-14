// Ficheiro: src/app/pages/daily-report/daily-report.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ReportDataService, DailyReportData } from '../../services/report-data';

@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule],
  templateUrl: './daily-report.html',
  styleUrl: './daily-report.css'
})
export class DailyReportComponent implements OnInit {

  reportData: DailyReportData[] = [];
  maquinaMaisTrabalhadora: DailyReportData | undefined;
  consumoTotalCorrente = 0;
  eficienciaMedia = 0;

  // ATUALIZAÇÃO: Adicionamos as novas colunas
  displayedColumns: string[] = ['nomeMaquina', 'horasTrabalhadas', 'consumoCorrente', 'eficiencia', 'diasTrabalhados', 'proximaManutencao'];

  constructor(private reportService: ReportDataService) {}

  ngOnInit(): void {
    this.reportService.getDailyReport().subscribe(data => {
      this.reportData = data;
      this.calcularKPIs();
    });
  }

  calcularKPIs(): void {
    if (this.reportData.length === 0) return;

    this.maquinaMaisTrabalhadora = this.reportData.reduce((prev, current) => 
      (prev.horasTrabalhadas > current.horasTrabalhadas) ? prev : current
    );
    this.consumoTotalCorrente = this.reportData.reduce((acc, item) => acc + item.consumoCorrente, 0);
    this.eficienciaMedia = this.reportData.reduce((acc, item) => acc + item.eficiencia, 0) / this.reportData.length;
  }

  // NOVO MÉTODO: Retorna uma classe CSS com base nos dias restantes para manutenção
  getManutencaoStatus(dias: number): string {
    if (dias <= 15) return 'alarme'; // Menos de 15 dias = Alarme
    if (dias <= 45) return 'atencao'; // Entre 16 e 45 dias = Atenção
    return 'normal'; // Mais de 45 dias = Normal
  }
}