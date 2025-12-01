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
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox'; // [NOVO] Checkbox
import { MatTooltipModule } from '@angular/material/tooltip';   // [NOVO] Tooltip
import { SingleReportData } from '../../modal/single-report-data/single-report-data'; 
import { ReportDataService } from '../../services/report-data'; 

@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatIconModule, 
    MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule,
    MatDatepickerModule, MatNativeDateModule, MatSelectModule,
    MatCheckboxModule, MatTooltipModule // [NOVO] Módulos adicionados
  ],
  templateUrl: './daily-report.html',
  styleUrl: './daily-report.css',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
})
export class DailyReportComponent implements OnInit {
  
  private allReports: SingleReportData[] = [];
  public dadosExibidos: SingleReportData[] = []; 
  
  public isLoading: boolean = true;
  public searchPerformed: boolean = false;

  public startDate: Date | null = null;
  public endDate: Date | null = null;

  public turnoSelecionado: string = 'todos';
  
  // [NOVO] Variável de controle do Checkbox
  public ignorarParadas: boolean = false;
  
  // KPIs
  mediaTem2C = 0;
  mediaQ90h = 0;
  mediaConz1Nivel = 0;
  mediaConz2Nivel = 0;
  mediaPre1Amp = 0;
  mediaPre2Amp = 0;
  mediaPre3Amp = 0;
  mediaPre4Amp = 0;

  // Paginação
  public currentPage: number = 1;
  public itemsPerPage: number = 100;
  public totalPages: number = 0;

  displayedColumns: string[] = [
    'reportId', 'dataHora', 'usuario', 'tem2C', 'q90h', 
    'conz1Nivel', 'conz2Nivel', 'pre1Amp', 'pre2Amp', 
    'pre3Amp', 'pre4Amp', 'excelId'
  ];

  constructor(private reportService: ReportDataService) {}

  ngOnInit(): void {
    this.reportService.loadAllReports().subscribe({
      next: (reports) => {
        this.allReports = reports.sort((a, b) => b.excelId - a.excelId);
        
        console.log(`DIAGNÓSTICO: ${this.allReports.length} relatórios carregados.`);
        
        this.totalPages = Math.ceil(this.allReports.length / this.itemsPerPage);
        this.isLoading = false;
        
        // Calcula inicial (considera estado inicial do checkbox)
        this.calcularKPIs(this.allReports); 
        this.irParaPagina(1);
      },
      error: (err) => {
        console.error("Erro ao carregar dados iniciais:", err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Filtrar Relatórios:
   * 1. Busca por DATA.
   * 2. Filtra por TURNO.
   * 3. Atualiza tabela.
   * 4. Chama calcularKPIs (que aplicará o filtro de paradas se checkbox ativo).
   */
  filtrarRelatorios(): void {
    if (!this.startDate || !this.endDate) {
      alert('Por favor, selecione as datas de início e fim.');
      return;
    }
    
    this.searchPerformed = true;
    this.isLoading = true; 
    
    this.reportService.getReportsByDateRange(this.startDate, this.endDate)
      .subscribe(dados => {
        
        let resultado = dados;

        // Filtro de Turno
        if (this.turnoSelecionado !== 'todos') {
          resultado = resultado.filter(report => 
            this.pertenceAoTurno(report.dataHora, this.turnoSelecionado)
          );
        }

        // Atualiza a tabela com o resultado do filtro de Data/Turno
        this.dadosExibidos = resultado; 
        
        // Recalcula KPIs (Aplicando filtro de "Paradas" se necessário)
        this.calcularKPIs(this.dadosExibidos);
        
        this.totalPages = 0; 
        this.currentPage = 1;
        this.isLoading = false;
      });
  }

  /**
   * [NOVO] Chamado quando o utilizador clica no Checkbox.
   * Recalcula os KPIs imediatamente sem precisar recarregar a API.
   */
  public aoAlterarCheckbox(): void {
    const dadosAtuais = this.searchPerformed ? this.dadosExibidos : this.allReports;
    this.calcularKPIs(dadosAtuais);
  }

  private pertenceAoTurno(dataString: string, turno: string): boolean {
    if (!dataString) return false;
    const date = new Date(dataString);
    if (isNaN(date.getTime())) return false;

    const hora = date.getHours(); 

    if (turno === 'turno1') {
      return hora >= 7 && hora < 18;
    }
    if (turno === 'turno2') {
      return hora >= 21 || hora < 7;
    }
    return true;
  }

  limparFiltro(): void {
    this.startDate = null;
    this.endDate = null;
    this.turnoSelecionado = 'todos';
    this.ignorarParadas = false; // Reseta o checkbox para o padrão

    this.totalPages = Math.ceil(this.allReports.length / this.itemsPerPage);
    this.irParaPagina(1); 
    this.searchPerformed = false;
    this.calcularKPIs(this.allReports); 
  }

  /**
   * [ATUALIZADO] Calcular KPIs
   * Regra: Se checkbox ativo, IGNORA registos onde 2 ou mais máquinas têm < 30A.
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

    // --- LÓGICA DE FILTRAGEM DE PARADAS ---
    let reportsValidos = reports;

    if (this.ignorarParadas) {
      reportsValidos = reports.filter(r => {
        let maquinasParadas = 0;

        // Verifica cada máquina individualmente (considera < 30 como parada)
        if ((r.pre1Amp || 0) < 30) maquinasParadas++;
        if ((r.pre2Amp || 0) < 30) maquinasParadas++;
        if ((r.pre3Amp || 0) < 30) maquinasParadas++;
        if ((r.pre4Amp || 0) < 30) maquinasParadas++;

        // REGRA: Se 2 ou mais máquinas estiverem paradas, IGNORA o registo.
        // Mantém apenas se tiver 0 ou 1 máquina parada.
        return maquinasParadas < 2; 
      });
    }

    // Se após o filtro não sobrar nada, zera KPIs
    if (reportsValidos.length === 0) {
      resetKPIs();
      return;
    }

    // --- CÁLCULO DE MÉDIAS (Usando apenas os reportsValidos) ---
    const reportsByDay = new Map<string, SingleReportData[]>();
    reportsValidos.forEach(report => {
      const reportDate = this.formatarData(report.dataHora); 
      if (reportDate) { 
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

  public formatarData(dataString: string): Date | null {
    if (!dataString) return null;
    const date = new Date(dataString);
    if (isNaN(date.getTime())) {
      console.warn(`AVISO: Data string inválida: ${dataString}`);
      return null;
    }
    return date;
  }

  imprimirKPIs(): void {
    window.print();
  }

  // --- Paginação ---
  public irParaPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPages || this.allReports.length === 0) return;
    this.currentPage = pagina;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.dadosExibidos = this.allReports.slice(startIndex, endIndex);
  }

  public proximaPagina(): void {
    if (this.currentPage < this.totalPages) this.irParaPagina(this.currentPage + 1);
  }

  public paginaAnterior(): void {
    if (this.currentPage > 1) this.irParaPagina(this.currentPage - 1);
  }
}