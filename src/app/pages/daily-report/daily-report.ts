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
  
  // Lista mestre (17k+ registos)
  private allReports: SingleReportData[] = [];
  
  // Lista de exibição (apenas 100 de cada vez)
  public dadosExibidos: SingleReportData[] = []; 
  
  public isLoading: boolean = true;
  public searchPerformed: boolean = false;

  public startDate: Date | null = null;
  public endDate: Date | null = null;
  
  // Propriedades dos KPIs
  mediaTem2C = 0;
  mediaQ90h = 0;
  mediaConz1Nivel = 0;
  mediaConz2Nivel = 0;
  mediaPre1Amp = 0;
  mediaPre2Amp = 0;
  mediaPre3Amp = 0;
  mediaPre4Amp = 0;

  // [NOVAS] Variáveis de Paginação
  public currentPage: number = 1;
  public itemsPerPage: number = 100; // Define quantos itens mostrar por página
  public totalPages: number = 0;

  displayedColumns: string[] = [
    'reportId', 'dataHora', 'usuario', 'tem2C', 'q90h', 
    'conz1Nivel', 'conz2Nivel', 'pre1Amp', 'pre2Amp', 
    'pre3Amp', 'pre4Amp', 'excelId'
  ];

  constructor(private reportService: ReportDataService) {}

  /**
   * [CORRIGIDO] ngOnInit:
   * 1. Carrega TODOS os relatórios (17k+)
   * 2. Mostra no console (como pediste)
   * 3. Calcula KPIs sobre TODOS
   * 4. Mostra apenas a PÁGINA 1 na tabela
   */
  ngOnInit(): void {
    this.reportService.loadAllReports().subscribe({
      next: (reports) => {
        // 1. Guarda na lista mestre
        this.allReports = reports.sort((a, b) => b.excelId - a.excelId);
        
        // 2. [O TEU PEDIDO] Mostra tudo no console
        console.log(`DIAGNÓSTICO: ${this.allReports.length} relatórios carregados na memória.`);
        // console.log(this.allReports); // Descomenta se quiseres ver o objeto
        
        // 3. Define os totais da paginação
        this.totalPages = Math.ceil(this.allReports.length / this.itemsPerPage);
        
        this.isLoading = false;
        
        // 4. Calcula os KPIs sobre a lista completa (agora seguro)
        this.calcularKPIs(this.allReports); 
        
        // 5. Mostra apenas a primeira página na tabela (não os 17k)
        this.irParaPagina(1);
      },
      error: (err) => {
        console.error("Erro ao carregar dados iniciais:", err);
        this.isLoading = false;
      }
    });
  }

  /**
   * [CORRIGIDO] filtrarRelatorios:
   * 1. Pede ao serviço os dados filtrados (do cache)
   * 2. Exibe os resultados (assumimos que o filtro é pequeno)
   * 3. Esconde os controlos de paginação (pois não se aplicam ao filtro)
   */
  filtrarRelatorios(): void {
    if (!this.startDate || !this.endDate) {
      alert('Por favor, selecione as datas de início e fim.');
      return;
    }
    
    this.searchPerformed = true;
    this.isLoading = true; // Mostra o loading
    
    this.reportService.getReportsByDateRange(this.startDate, this.endDate)
      .subscribe(dados => {
        // Mostra o resultado do filtro diretamente
        this.dadosExibidos = dados; 
        
        // Calcula KPIs sobre o resultado do filtro
        this.calcularKPIs(this.dadosExibidos);
        
        // Esconde os controlos de paginação, pois estamos a ver um filtro
        this.totalPages = 0; 
        this.currentPage = 1;
        this.isLoading = false;
      });
  }

  /**
   * [CORRIGIDO] limparFiltro:
   * 1. Limpa as datas
   * 2. Restaura a tabela para a PÁGINA 1 da lista completa
   * 3. Restaura os KPIs da lista completa
   */
  limparFiltro(): void {
    this.startDate = null;
    this.endDate = null;
    
    // Restaura os totais da paginação
    this.totalPages = Math.ceil(this.allReports.length / this.itemsPerPage);
    
    // Restaura a tabela para a lista mestre (página 1)
    this.irParaPagina(1); 
    
    this.searchPerformed = false;
    
    // Restaura os KPIs para a lista mestre
    this.calcularKPIs(this.allReports); 
  }

  /**
   * calcularKPIs:
   * (O teu código está ótimo, desde que 'formatarData' seja seguro)
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
      
      // A função 'formatarData' corrigida vai saltar datas inválidas
      const reportDate = this.formatarData(report.dataHora); 
      
      if (reportDate) { // Só processa se a data for válida
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

    this.mediaTem2C = calculateFinalAverage(dailyAverages['tem2C']);
    this.mediaQ90h = calculateFinalAverage(dailyAverages['q90h']);
    this.mediaConz1Nivel = calculateFinalAverage(dailyAverages['conz1Nivel']);
    this.mediaConz2Nivel = calculateFinalAverage(dailyAverages['conz2Nivel']);
    this.mediaPre1Amp = calculateFinalAverage(dailyAverages['pre1Amp']);
    this.mediaPre2Amp = calculateFinalAverage(dailyAverages['pre2Amp']);
    this.mediaPre3Amp = calculateFinalAverage(dailyAverages['pre3Amp']);
    this.mediaPre4Amp = calculateFinalAverage(dailyAverages['pre4Amp']);
  }

  /**
   * [CORRIGIDO] formatarData:
   * Esta versão é "à prova de falhas" (safe).
   * Ela retorna 'null' se os dados da data estiverem corrompidos,
   * evitando o 'RangeError' que estavas a ter.
   */
  public formatarData(dataArray: number[]): Date | null {
    if (!dataArray || dataArray.length < 6) {
      return null;
    }

    const date = new Date(
      dataArray[0], 
      dataArray[1] - 1, // Mês é 0-indexado
      dataArray[2], 
      dataArray[3], 
      dataArray[4], 
      dataArray[5]
    );

    // [A CORREÇÃO] Verifica se a data criada é válida
    // Se os dados forem (0, 0, 0...) ou (null), a data é "Invalid Date"
    if (isNaN(date.getTime())) {
      console.warn("AVISO: Detectada data inválida no relatório.", dataArray);
      return null;
    }

    return date;
  }

  imprimirKPIs(): void {
    window.print();
  }

  // --- [NOVAS] Funções de Paginação ---

  /**
   * O cérebro da paginação. Pega na lista 'allReports'
   * e mostra a fatia correta em 'dadosExibidos'.
   */
  public irParaPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPages) {
      return;
    }

    this.currentPage = pagina;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // O "slice" pega a fatia sem travar o navegador!
    this.dadosExibidos = this.allReports.slice(startIndex, endIndex);
  }

  public proximaPagina(): void {
    if (this.currentPage < this.totalPages) {
      this.irParaPagina(this.currentPage + 1);
    }
  }

  public paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.irParaPagina(this.currentPage - 1);
    }
  }
}