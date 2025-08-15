// Ficheiro: src/app/pages/daily-report/daily-report.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { RealTimeChartComponent } from '../../dialogs/real-time-chart/real-time-chart';

// 1. Importamos a interface do nosso ficheiro de modelo
import { DailyReportData } from '../../modal/daily-report-data/daily-report-data'; 
// 2. Importamos o serviço do ficheiro .service.ts
import { ReportDataService } from '../../services/report-data'; // Corrigido o caminho para .service
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
  ) {}

  ngOnInit(): void {
    // --- LÓGICA EXISTENTE PARA ATUALIZAÇÃO EM TEMPO REAL ---
    // Esta parte continua a buscar os dados a cada segundo.
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

    // --- NOVA LÓGICA PARA TESTAR A BUSCA POR DATA/HORA ---
    // Esta função será chamada uma única vez quando o componente iniciar.
    this.testarBuscaPorDataHora();
  }

  /**
   * Função de teste para chamar o novo método do serviço e exibir o resultado no console.
   */
  testarBuscaPorDataHora(): void {
    // Defina aqui a data e hora exata que você quer buscar.
    // IMPORTANTE: Use uma data e hora que você TENHA CERTEZA que existe no seu banco de dados.
    const dataHoraParaTeste = '2025-08-15 10:00:00'; // <-- MUDE AQUI SE NECESSÁRIO

    console.log(`%c[TESTE] A solicitar relatório para: ${dataHoraParaTeste}`, 'color: blue; font-weight: bold;');

    this.reportService.getReportByDateTime(dataHoraParaTeste).subscribe({
      next: (dadosDoRelatorio) => {
        // Sucesso! Os dados chegaram.
        console.log('%c[TESTE] Relatório específico recebido com SUCESSO:', 'color: green; font-weight: bold;', dadosDoRelatorio);
      },
      error: (erro) => {
        // Ocorreu um erro.
        console.error('%c[TESTE] Falha ao buscar o relatório específico:', 'color: red; font-weight: bold;', erro);
      }
    });
  }

  // --- MÉTODOS EXISTENTES DO COMPONENTE ---

  salvarRelatorio(): void {
    if (this.reportData.length === 0) {
      // Usar um modal ou um snackbar seria melhor que um alert.
      console.warn('Não há dados para salvar e baixar.');
      return;
    }
    // Lógica para salvar o relatório...
  }

  calcularKPIs(): void {
    if (!this.reportData || this.reportData.length === 0) {
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
      return statusAnormal || temperaturaElevada || correnteIrregular;
    }).length;

    this.maquinaMaisTrabalhadora = this.reportData.reduce((prev, current) =>
      (prev.horasTrabalhadas > current.horasTrabalhadas) ? prev : current
    );

    this.consumoTotalCorrente = this.reportData.reduce((acc, item) => acc + (item.consumoCorrente || 0), 0);

    const totalEficiencia = this.reportData.reduce((acc, item) => acc + item.eficiencia, 0);
    this.eficienciaMedia = totalEficiencia / this.reportData.length;
  }

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
      data: { machine: machineData }
    });
  }
}
