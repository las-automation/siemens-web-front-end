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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // [IMPORTANTE]

// Serviços e Modelos
import { SingleReportData } from '../../modal/single-report-data/single-report-data'; 
import { ReportDataService } from '../../services/report-data'; 
import { OilDataService } from '../../services/oil-data.service'; 
import { ExtracaoOleo } from '../../modal/extracao-oleo';         
import { OilExtractionDialogComponent } from '../../dialogs/oil-extraction-dialog/oil-extraction-dialog.component'; 

@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatIconModule, 
    MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule,
    MatDatepickerModule, MatNativeDateModule, MatSelectModule,
    MatCheckboxModule, MatTooltipModule, MatDialogModule
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
  
  // Variáveis para o Óleo (Corrigindo o erro TS2339)
  public todosRegistosOleo: ExtracaoOleo[] = [];
  public totalTanquesCheios: number = 0;

  public isLoading: boolean = true;
  public searchPerformed: boolean = false;

  public startDate: Date | null = null;
  public endDate: Date | null = null;

  public turnoSelecionado: string = 'todos';
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

  constructor(
    private reportService: ReportDataService,
    private oilService: OilDataService, // Injeção Corrigida
    private dialog: MatDialog           // Injeção Corrigida
  ) {}

  ngOnInit(): void {
    // Carrega dados de Óleo
    this.carregarDadosOleo();

    // Carrega dados de Máquinas
    this.reportService.loadAllReports().subscribe({
      next: (reports) => {
        this.allReports = reports.sort((a, b) => b.excelId - a.excelId);
        
        this.totalPages = Math.ceil(this.allReports.length / this.itemsPerPage);
        this.isLoading = false;
        
        this.calcularKPIs(this.allReports); 
        this.irParaPagina(1);
      },
      error: (err: any) => { // Tipagem explícita para evitar TS7006
        console.error("Erro ao carregar dados iniciais:", err);
        this.isLoading = false;
      }
    });
  }

  // --- LÓGICA DO ÓLEO ---

carregarDadosOleo(): void {
    // Agora o método existe no serviço
    this.oilService.getAllExtractions().subscribe({
      // [CORREÇÃO] Adicionamos o tipo explícito ': ExtracaoOleo[]' aqui
      next: (dados: ExtracaoOleo[]) => {
        this.todosRegistosOleo = dados;
        this.filtrarOleo();
      },
      // [CORREÇÃO] Adicionamos ': any' aqui também para evitar erros futuros
      error: (err: any) => console.error("Erro ao carregar óleo:", err)
    });
  }

  filtrarOleo(): void {
    let oleoFiltrado = this.todosRegistosOleo;

    if (this.startDate && this.endDate) {
      const inicio = new Date(this.startDate); inicio.setHours(0,0,0,0);
      const fim = new Date(this.endDate); fim.setHours(23,59,59,999);

      oleoFiltrado = oleoFiltrado.filter(item => {
        const dataItem = new Date(item.dataExtracao + 'T00:00:00'); 
        return dataItem >= inicio && dataItem <= fim;
      });
    }

    if (this.turnoSelecionado === 'turno1') {
      oleoFiltrado = oleoFiltrado.filter(item => item.turno === 1);
    } else if (this.turnoSelecionado === 'turno2') {
      oleoFiltrado = oleoFiltrado.filter(item => item.turno === 2);
    }

    this.totalTanquesCheios = oleoFiltrado.reduce((acc, curr) => acc + curr.tanquesCompletos, 0);
  }

  // Função chamada pelo botão no HTML (Corrigindo o erro TS2339)
  abrirRegistroOleo(): void {
    const dialogRef = this.dialog.open(OilExtractionDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.carregarDadosOleo();
      }
    });
  }

  // --- LÓGICA DE FILTROS ---

  filtrarRelatorios(): void {
    if (!this.startDate || !this.endDate) {
      alert('Por favor, selecione as datas de início e fim.');
      return;
    }
    
    this.searchPerformed = true;
    this.isLoading = true; 

    this.filtrarOleo();
    
    this.reportService.getReportsByDateRange(this.startDate, this.endDate)
      .subscribe({
        next: (dados) => {
          let resultado = dados;

          if (this.turnoSelecionado !== 'todos') {
            resultado = resultado.filter(report => 
              this.pertenceAoTurno(report.dataHora, this.turnoSelecionado)
            );
          }

          this.dadosExibidos = resultado; 
          this.calcularKPIs(this.dadosExibidos);
          
          this.totalPages = 0; 
          this.currentPage = 1;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error("Erro ao filtrar:", err);
          this.isLoading = false;
        }
      });
  }

  aoAlterarCheckbox(): void {
    const dadosAtuais = this.searchPerformed ? this.dadosExibidos : this.allReports;
    this.calcularKPIs(dadosAtuais);
  }

  private pertenceAoTurno(dataString: string, turno: string): boolean {
    if (!dataString) return false;
    const date = new Date(dataString);
    if (isNaN(date.getTime())) return false;

    const hora = date.getHours(); 

    if (turno === 'turno1') return hora >= 7 && hora < 18;
    if (turno === 'turno2') return hora >= 21 || hora < 7;
    return true;
  }

  limparFiltro(): void {
    this.startDate = null;
    this.endDate = null;
    this.turnoSelecionado = 'todos';
    this.ignorarParadas = false;

    this.filtrarOleo();

    this.totalPages = Math.ceil(this.allReports.length / this.itemsPerPage);
    this.irParaPagina(1); 
    this.searchPerformed = false;
    this.calcularKPIs(this.allReports); 
  }

  // --- CÁLCULO DE KPIs ---

  calcularKPIs(reports: SingleReportData[]): void {
    // [CORREÇÃO] Adicionado 'this.' para resolver TS2663
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

    let reportsValidos = reports;

    if (this.ignorarParadas) {
      reportsValidos = reports.filter(r => {
        let maquinasParadas = 0;
        if ((r.pre1Amp || 0) < 30) maquinasParadas++;
        if ((r.pre2Amp || 0) < 30) maquinasParadas++;
        if ((r.pre3Amp || 0) < 30) maquinasParadas++;
        if ((r.pre4Amp || 0) < 30) maquinasParadas++;
        return maquinasParadas < 2; 
      });
    }

    if (reportsValidos.length === 0) {
      resetKPIs();
      return;
    }

    const calculateFinalAverage = (metric: keyof SingleReportData): number => {
      const validReports = reportsValidos.filter(r => typeof r[metric] === 'number');
      if (validReports.length === 0) return 0;
      const total = validReports.reduce((acc, r) => acc + (r[metric] as number), 0);
      return total / validReports.length;
    };

    this.mediaTem2C = calculateFinalAverage('tem2C');
    this.mediaQ90h = calculateFinalAverage('q90h');
    this.mediaConz1Nivel = calculateFinalAverage('conz1Nivel');
    this.mediaConz2Nivel = calculateFinalAverage('conz2Nivel');
    this.mediaPre1Amp = calculateFinalAverage('pre1Amp');
    this.mediaPre2Amp = calculateFinalAverage('pre2Amp');
    this.mediaPre3Amp = calculateFinalAverage('pre3Amp');
    this.mediaPre4Amp = calculateFinalAverage('pre4Amp');
  }

  public formatarData(dataString: string): Date | null {
    if (!dataString) return null;
    const date = new Date(dataString);
    return isNaN(date.getTime()) ? null : date;
  }

  imprimirKPIs(): void {
    window.print();
  }

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