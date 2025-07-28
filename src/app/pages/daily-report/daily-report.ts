// Ficheiro: src/app/pages/daily-report/daily-report.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ReportDataService, DailyReportData } from '../../services/report-data';
import { MatDialog } from '@angular/material/dialog';
import { RealTimeChartComponent } from '../../dialogs/real-time-chart/real-time-chart';
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

  private dataSubscription!: Subscription;

   displayedColumns: string[] = ['nomeMaquina', 'horasTrabalhadas', 'consumoCorrente', 'eficiencia', 'diasTrabalhados', 'proximaManutencao', 'acoes'];

  constructor(private reportService: ReportDataService, public dialog: MatDialog) {}

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
    console.log('O botão Salvar Relatório foi clicado!');

    if (this.reportData.length === 0) {
      alert('Não há dados para salvar.');
      return;
    }

    // A lógica aqui seria chamar um método do serviço para salvar o estado atual.
    // O backend precisaria de ter um endpoint para receber este "snapshot".
    // Exemplo:
    // this.reportService.saveReportSnapshot(this.reportData).subscribe(() => {
    //   alert('Relatório histórico salvo com sucesso!');
    // });

    // Por agora, vamos apenas mostrar os dados que seriam salvos:
    alert('Funcionalidade de salvar snapshot a ser implementada.');
    console.log('Dados que seriam salvos como histórico:', this.reportData);
  }

  // 5. Método para calcular os KPIs
  calcularKPIs(): void {
    if (!this.reportData || this.reportData.length === 0) {
      // Se não houver dados, resetamos os valores
      this.maquinaMaisTrabalhadora = undefined;
      this.consumoTotalCorrente = 0;
      this.eficienciaMedia = 0;
      return;
    }

    this.maquinaMaisTrabalhadora = this.reportData.reduce((prev, current) =>
      (prev.horasTrabalhadas > current.horasTrabalhadas) ? prev : current
    );

    this.consumoTotalCorrente = this.reportData.reduce((acc, item) => acc + item.consumoCorrente, 0);

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

  abrirGrafico(nomeMaquina: string): void {
    this.dialog.open(RealTimeChartComponent, {
      width: '800px',
      data: { machineName: nomeMaquina } // Passa o nome da máquina para o diálogo
    });
  }
}
