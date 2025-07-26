// Ficheiro: src/app/pages/daily-report/daily-report.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ReportDataService, DailyReportData } from '../../services/report-data';
import { MatDialog } from '@angular/material/dialog';
import { RealTimeChartComponent } from '../../dialogs/real-time-chart/real-time-chart';
import { MachinesReport } from "../../features/machines-report/machines-report";


@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatTableModule, 
    MatIconModule, 
    MachinesReport,
    MachinesReport,
  ],
  templateUrl: './daily-report.html',
  styleUrl: './daily-report.css'
})
export class DailyReportComponent implements OnInit {

  reportData: DailyReportData[] = [];
  maquinaMaisTrabalhadora: DailyReportData | undefined;
  consumoTotalCorrente = 0;
  eficienciaMedia = 0;

   displayedColumns: string[] = ['nomeMaquina', 'horasTrabalhadas', 'consumoCorrente', 'eficiencia', 'diasTrabalhados', 'proximaManutencao', 'acoes'];

  constructor(private reportService: ReportDataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    // CORREÇÃO: Adicionamos o tipo explícito 'DailyReportData[]' ao parâmetro 'data'.
    this.reportService.getDailyReport().subscribe((data: DailyReportData[]) => {
      this.reportData = data;
    });
  }

  buscarDados(): void {
    console.log('Componente a pedir dados ao serviço...');
    this.reportService.getDailyReport().subscribe(dadosRecebidos => {
      console.log('Componente recebeu os dados!', dadosRecebidos);
      this.reportData = dadosRecebidos;
    });
  }

  // Exemplo de como usaríamos a função de salvar
  salvarPrimeiroRelatorio(): void {
    if (this.reportData.length > 0) {
      const primeiroReport = this.reportData[0];
      console.log('Componente a pedir para salvar o relatório:', primeiroReport);
      this.reportService.createReport(primeiroReport).subscribe({
        next: () => {
          alert('Relatório salvo com sucesso!');
          // Opcional: atualizar a lista depois de salvar
          this.buscarDados(); 
        },
        error: (err) => {
          alert('Falha ao salvar o relatório.');
          console.error(err);
        }
      });
    } else {
      alert('Não há dados para salvar!');
    }
  }

  getManutencaoStatus(dias: number): string {
    if (dias <= 15) return 'alarme';
    if (dias <= 45) return 'atencao';
    return 'normal';
  }

  abrirGrafico(nomeMaquina: string): void {
    this.dialog.open(RealTimeChartComponent, {
      width: '800px',
      data: { machineName: nomeMaquina } // Passa o nome da máquina para o diálogo
    });
  }
}
