// Ficheiro: src/app/pages/daily-report/daily-report.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { RealTimeChartComponent } from '../../dialogs/real-time-chart/real-time-chart';
import { ReportDownloadService } from '../../services/report-download';

// 1. Importamos a interface do nosso ficheiro de modelo
import { DailyReportData } from '../../modal/daily-report-data/daily-report-data'; 
// 2. Importamos o serviço do ficheiro .service.ts
import { ReportDataService } from '../../services/report-data'; 
// 3. Importamos os componentes filhos que serão usados no template
import { MachinesReport } from "../../features/machines-report/machines-report";
import { SaveButtonComponent } from '../../components/save-button/save-button';

import { Subscription, interval } from 'rxjs'
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatTableModule, 
    MatIconModule, 
    MachinesReport,
    SaveButtonComponent,
  ],
  templateUrl: './daily-report.html',
  styleUrl: './daily-report.css'
})
export class DailyReportComponent implements OnInit, OnDestroy {

  reportData: DailyReportData[] = [];
  maquinaMaisTrabalhadora: DailyReportData | undefined;
  consumoTotalCorrente = 0;
  eficienciaMedia = 0;
  alertasNoDia = 0;

   private readonly LIMITE_TEMPERATURA = 90.0; // Ex: Alerta acima de 90°C
  private readonly LIMITE_CORRENTE = 180.0; // Ex: Alerta acima de 180A

  private dataSubscription!: Subscription;

   displayedColumns: string[] = ['nomeMaquina', 'horasTrabalhadas', 'consumoCorrente', 'eficiencia', 'diasTrabalhados', 'proximaManutencao', 'acoes'];

  constructor(
    private reportService: ReportDataService, 
    public dialog: MatDialog,
    private reportDownloadService: ReportDownloadService
  ) {}

  ngOnInit(): void {
    
    this.dataSubscription = interval(1000)

      .pipe(
        // O switchMap cancela a requisição anterior se uma nova começar
        switchMap(() => this.reportService.getDailyReport())
      )
      .subscribe(data => {
        console.log('Dados atualizados em tempo real!', data);
        this.reportData = data;
        this.calcularKPIs();
      });
    // CORREÇÃO: Adicionamos o tipo explícito 'DailyReportData[]' ao parâmetro 'data'.
    this.reportService.getDailyReport().subscribe((data: DailyReportData[]) => {
      this.reportData = data;
    });
  }

  // 3. Crie o método que será executado quando o evento for recebido
    salvarRelatorio(): void {
    if (this.reportData.length === 0) {
      alert('Não há dados para salvar e baixar.');
      return;
    }

    // Primeiro, salva o snapshot
    this.reportService.saveReportSnapshot(this.reportData).subscribe({
      next: (response) => {
        alert('Snapshot salvo com sucesso! A iniciar o download do PDF...');
        // Se salvar funcionou, usa o ID recebido para pedir o download
        this.downloadService.downloadSnapshotAsPdf(response.historyId);
      },
      error: (err) => {
        alert('Ocorreu um erro ao salvar o snapshot.');
        console.error(err);
      }
    });
  }

  // 5. Método para calcular os KPIs
  calcularKPIs(): void {
    if (!this.reportData || this.reportData.length === 0) {
      // Se não houver dados, resetamos os valores
      this.maquinaMaisTrabalhadora = undefined;
      this.consumoTotalCorrente = 0;
      this.eficienciaMedia = 0;
      this.alertasNoDia = 0;
      return;
    }

    this.alertasNoDia = this.reportData.filter(item => {
      const statusAnormal = item.status !== 'Operando';
      const temperaturaElevada = item.temperatura > this.LIMITE_TEMPERATURA;
      const correnteIrregular = item.corrente > this.LIMITE_CORRENTE;

      // Se qualquer uma das condições for verdadeira, é um alerta.
      return statusAnormal || temperaturaElevada || correnteIrregular;
    }).length;

    this.maquinaMaisTrabalhadora = this.reportData.reduce((prev, current) =>
      (prev.horasTrabalhadas > current.horasTrabalhadas) ? prev : current
    );

     this.consumoTotalCorrente = this.reportData.reduce((acc, item) => acc + (item.consumoCorrente || 0), 0);

    const totalEficiencia = this.reportData.reduce((acc, item) => acc + item.eficiencia, 0);
    this.eficienciaMedia = totalEficiencia / this.reportData.length;
  }

    // 6. É ESSENCIAL limpar a inscrição quando o componente é destruído
  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  getManutencaoStatus(dias: number): string {
    if (dias <= 15) return 'alarme';
    if (dias <= 45) return 'atencao';
    return 'normal';
  }

  abrirGrafico(machineData: DailyReportData): void {
    console.log('Evento recebido pelo pai! A abrir o modal para:', machineData.nomeMaquina);
    this.dialog.open(RealTimeChartComponent, {
      width: '800px',
      // Passamos os dados da máquina para o modal
      data: { machine: machineData }
    });
  }
}
