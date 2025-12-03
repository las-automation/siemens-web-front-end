import { Component, Inject, OnInit, Injectable } from '@angular/core';
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
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { of, Observable } from 'rxjs';

// --- INTERFACES (Simuladas para o exemplo) ---
export interface ExtracaoOleo {
  id?: number;
  tanquesCompletos: number;
  alturaIncompletoCm: number;
  tanqueGrande: number;
  turno: number;
  dataExtracao: string;
}

export interface SingleReportData {
  reportId: number;
  dataHora: string;
  usuario: string;
  tem2C: number;
  q90h: number;
  conz1Nivel: number;
  conz2Nivel: number;
  pre1Amp: number;
  pre2Amp: number;
  pre3Amp: number;
  pre4Amp: number;
  excelId: number;
}

// --- SERVICES (Mocks para o exemplo funcionar na visualização) ---
@Injectable({ providedIn: 'root' })
export class OilDataService {
  // Dados simulados
  private mockData: ExtracaoOleo[] = [
    { id: 1, tanquesCompletos: 6, alturaIncompletoCm: 176, tanqueGrande: 4.37, turno: 1, dataExtracao: '2025-02-12' },
    { id: 2, tanquesCompletos: 6, alturaIncompletoCm: 176, tanqueGrande: 4.37, turno: 1, dataExtracao: '2025-02-12' } // Simulando a duplicidade
  ];

  getAllExtractions(): Observable<ExtracaoOleo[]> {
    return of(this.mockData);
  }
  saveExtraction(data: ExtracaoOleo): Observable<any> {
    this.mockData.push({ ...data, id: Date.now() });
    return of(true);
  }
  updateExtraction(id: number, data: ExtracaoOleo): Observable<any> {
    const index = this.mockData.findIndex(d => d.id === id);
    if (index > -1) this.mockData[index] = data;
    return of(true);
  }
  deleteExtraction(id: number): Observable<any> {
    this.mockData = this.mockData.filter(d => d.id !== id);
    return of(true);
  }
}

@Injectable({ providedIn: 'root' })
export class ReportDataService {
  loadAllReports(): Observable<SingleReportData[]> {
    return of([]);
  }
  getReportsByDateRange(start: Date, end: Date): Observable<SingleReportData[]> {
    return of([]);
  }
}

// --- COMPONENT: OIL EXTRACTION DIALOG (Incluído no mesmo arquivo para compilação) ---
@Component({
  selector: 'app-oil-extraction-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatRadioModule, MatDatepickerModule, 
    MatNativeDateModule, MatIconModule, MatDividerModule
  ],
  template: `
    <h2 mat-dialog-title style="display:flex; align-items:center; gap:10px;">
      <mat-icon>water_drop</mat-icon> 
      {{ isEditMode ? 'Editar Registo' : 'Novo Registo de Óleo' }}
    </h2>

    <mat-dialog-content>
      
      @if (isDuplicate) {
        <div style="background-color: #ffebee; color: #c62828; padding: 10px; border-radius: 4px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
          <mat-icon>error</mat-icon>
          <span><strong>Atenção:</strong> Já existe um registo para esta Data e Turno.</span>
        </div>
      }

      <div style="display:flex; flex-direction:column; gap: 15px; padding-top: 10px;">

        <div style="display:flex; gap:15px;">
          <mat-form-field appearance="outline" style="flex:1;">
            <mat-label>Data</mat-label>
            <input matInput [matDatepicker]="picker" [(ngModel)]="dataRegistro" (dateChange)="verificarDuplicidade()">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" style="flex:1;">
            <mat-label>Turno</mat-label>
            <mat-select [(ngModel)]="turno" (selectionChange)="verificarDuplicidade()">
              <mat-option [value]="1">Turno 1</mat-option>
              <mat-option [value]="2">Turno 2</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-divider></mat-divider>

        <div>
          <label style="font-weight:500;">Quantos tanques cheios?</label>
          <mat-form-field appearance="outline" style="width:100%; margin-top:5px;">
            <input matInput type="number" min="0" [(ngModel)]="qtdCheios" placeholder="Ex: 2">
            <span matSuffix>unid.</span>
          </mat-form-field>
        </div>

        <div>
          <label style="font-weight:500; display:block; margin-bottom:5px;">Ficou algum incompleto?</label>
          <mat-radio-group [(ngModel)]="temIncompleto" color="primary">
            <mat-radio-button value="nao" style="margin-right:15px;">Não</mat-radio-button>
            <mat-radio-button value="sim">Sim</mat-radio-button>
          </mat-radio-group>

          @if (temIncompleto === 'sim') {
            <div style="margin-top:10px;">
              <mat-form-field appearance="outline" style="width:100%;">
                <mat-label>Qual a altura em cm?</mat-label>
                <input matInput type="number" min="0" max="99" [(ngModel)]="alturaIncompleto">
                <span matSuffix>cm</span>
              </mat-form-field>
            </div>
          }
        </div>

        <div style="background-color: #f5f5f5; padding: 10px; border-radius: 8px;">
          <label style="font-weight:500;">Nível do Tanque Grande:</label>
          <mat-form-field appearance="outline" style="width:100%; margin-top:5px;">
            <input matInput type="number" step="0.1" [(ngModel)]="tanqueGrande" placeholder="0.0 a 6.0">
            <mat-icon matSuffix>propane_tank</mat-icon>
          </mat-form-field>
        </div>

      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">Cancelar</button>
      
      <button mat-raised-button color="primary" (click)="salvar()" [disabled]="isSaving || isDuplicate">
        {{ isSaving ? 'Salvando...' : 'Salvar' }}
      </button>
    </mat-dialog-actions>
  `,
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }]
})
export class OilExtractionDialogComponent implements OnInit {

  public dataRegistro: Date = new Date();
  public turno: number = 1;
  public qtdCheios: number = 0;
  
  public temIncompleto: string = 'nao';
  public alturaIncompleto: number | null = null;
  public tanqueGrande: number | null = null;
  
  public isSaving: boolean = false;
  public isEditMode: boolean = false;
  public currentId: number | null = null;

  // [NOVO] Controle de Duplicidade
  public isDuplicate: boolean = false;
  private listaExistente: ExtracaoOleo[] = [];

  constructor(
    private dialogRef: MatDialogRef<OilExtractionDialogComponent>,
    private oilService: OilDataService,
    @Inject(MAT_DIALOG_DATA) public dataRecebida: any // Recebe o objeto { registro, listaExistente }
  ) {}

  ngOnInit(): void {
    // Carrega a lista para verificação
    if (this.dataRecebida && this.dataRecebida.listaExistente) {
      this.listaExistente = this.dataRecebida.listaExistente;
    }

    // Modo Edição
    if (this.dataRecebida && this.dataRecebida.registro) {
      const dados = this.dataRecebida.registro;
      this.isEditMode = true;
      this.currentId = dados.id;
      this.qtdCheios = dados.tanquesCompletos;
      this.tanqueGrande = dados.tanqueGrande;
      this.turno = dados.turno;
      
      if (dados.dataExtracao) {
        this.dataRegistro = new Date(dados.dataExtracao + 'T00:00:00');
      }

      if (dados.alturaIncompletoCm > 0) {
        this.temIncompleto = 'sim';
        this.alturaIncompleto = dados.alturaIncompletoCm;
      }
    }
    
    // Verifica logo no início (caso a data padrão já tenha registo)
    this.verificarDuplicidade();
  }

  // [NOVO] Função chamada sempre que muda Data ou Turno
  verificarDuplicidade(): void {
    if (!this.dataRegistro) return;

    const ano = this.dataRegistro.getFullYear();
    const mes = String(this.dataRegistro.getMonth() + 1).padStart(2, '0');
    const dia = String(this.dataRegistro.getDate()).padStart(2, '0');
    const dataString = `${ano}-${mes}-${dia}`;

    // Procura se já existe na lista
    const duplicado = this.listaExistente.find(item => 
      item.dataExtracao === dataString && item.turno === this.turno
    );

    // Se achou um, e NÃO estamos a editar esse mesmo registo -> É DUPLICADO
    if (duplicado && (!this.isEditMode || duplicado.id !== this.currentId)) {
      this.isDuplicate = true;
    } else {
      this.isDuplicate = false;
    }
  }

  salvar(): void {
    if (this.isDuplicate) {
      alert("Já existe um registo para esta Data e Turno!");
      return;
    }
    if (this.tanqueGrande === null) {
      alert("Preencha o nível do Tanque Grande.");
      return;
    }

    let alturaFinal = 0;
    if (this.temIncompleto === 'sim') {
      if (this.alturaIncompleto === null) {
        alert("Digite a altura do tanque incompleto.");
        return;
      }
      alturaFinal = Number(this.alturaIncompleto);
    }

    this.isSaving = true;

    const ano = this.dataRegistro.getFullYear();
    const mes = String(this.dataRegistro.getMonth() + 1).padStart(2, '0');
    const dia = String(this.dataRegistro.getDate()).padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`;

    const payload: ExtracaoOleo = {
      ...(this.isEditMode && this.currentId ? { id: this.currentId } : { tanquesCompletos: 0, alturaIncompletoCm: 0, tanqueGrande: 0, turno: 0, dataExtracao: '' }), // Mock fix
      tanquesCompletos: Number(this.qtdCheios),
      alturaIncompletoCm: alturaFinal,
      tanqueGrande: Number(this.tanqueGrande),
      turno: Number(this.turno),
      dataExtracao: dataFormatada
    };
    if (this.isEditMode && this.currentId) payload.id = this.currentId;

    const request$ = this.isEditMode && this.currentId
      ? this.oilService.updateExtraction(this.currentId, payload)
      : this.oilService.saveExtraction(payload);

    request$.subscribe({
      next: () => {
        alert(this.isEditMode ? "Atualizado com sucesso!" : "Salvo com sucesso!");
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Erro ao salvar:', err);
        this.isSaving = false;
        alert("Erro ao salvar. Verifique a conexão.");
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}

// --- MAIN COMPONENT: DAILY REPORT ---
@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatIconModule, 
    MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule,
    MatDatepickerModule, MatNativeDateModule, MatSelectModule,
    MatCheckboxModule, MatTooltipModule, MatDialogModule, MatDividerModule
  ],
  templateUrl: './daily-report.html',
  styleUrl: './daily-report.css',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
})
export class DailyReportComponent implements OnInit {
  
  // Dados de Máquinas
  private allReports: SingleReportData[] = [];
  public dadosExibidos: SingleReportData[] = []; 
  
  // Dados de Óleo
  public todosRegistosOleo: ExtracaoOleo[] = [];
  public totalTanquesCheios: number = 0;
  public totalIncompleto: number = 0;   
  public mediaTanqueGrande: number = 0; 
  public registroOleoAtual: ExtracaoOleo | null = null; // Para edição

  // Estados da Tela
  public isLoading: boolean = true;
  public searchPerformed: boolean = false;

  // Filtros
  public startDate: Date | null = null;
  public endDate: Date | null = null;
  public turnoSelecionado: string = 'todos';
  public ignorarParadas: boolean = false;
  
  // KPIs Máquinas
  mediaTem2C = 0; mediaQ90h = 0;
  mediaConz1Nivel = 0; mediaConz2Nivel = 0;
  mediaPre1Amp = 0; mediaPre2Amp = 0; 
  mediaPre3Amp = 0; mediaPre4Amp = 0;

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
    private oilService: OilDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // 1. Carrega dados de Óleo
    this.carregarDadosOleo();

    // 2. Carrega dados de Máquinas
    this.reportService.loadAllReports().subscribe({
      next: (reports) => {
        this.allReports = reports.sort((a, b) => b.excelId - a.excelId);
        this.totalPages = Math.ceil(this.allReports.length / this.itemsPerPage);
        this.isLoading = false;
        
        this.calcularKPIs(this.allReports); 
        this.irParaPagina(1);
      },
      error: (err: any) => {
        console.error("Erro ao carregar dados iniciais:", err);
        this.isLoading = false;
      }
    });
  }

  // --- LÓGICA DO ÓLEO ---

  carregarDadosOleo(): void {
    this.oilService.getAllExtractions().subscribe({
      next: (dados: ExtracaoOleo[]) => {
        this.todosRegistosOleo = dados;
        this.filtrarOleo();
      },
      error: (err: any) => console.error("Erro ao carregar óleo:", err)
    });
  }

  filtrarOleo(): void {
    let oleoFiltrado = this.todosRegistosOleo;

    // Filtro de Data
    if (this.startDate && this.endDate) {
      const inicio = new Date(this.startDate); inicio.setHours(0,0,0,0);
      const fim = new Date(this.endDate); fim.setHours(23,59,59,999);

      oleoFiltrado = oleoFiltrado.filter(item => {
        const dataItem = new Date(item.dataExtracao + 'T00:00:00'); 
        return dataItem >= inicio && dataItem <= fim;
      });
    }

    // Filtro de Turno
    if (this.turnoSelecionado === 'turno1') {
      oleoFiltrado = oleoFiltrado.filter(item => item.turno === 1);
    } else if (this.turnoSelecionado === 'turno2') {
      oleoFiltrado = oleoFiltrado.filter(item => item.turno === 2);
    }

    // Cálculos de KPIs
    this.totalTanquesCheios = oleoFiltrado.reduce((acc, curr) => acc + curr.tanquesCompletos, 0);
    this.totalIncompleto = oleoFiltrado.reduce((acc, curr) => acc + (curr.alturaIncompletoCm || 0), 0);
    
    if (oleoFiltrado.length > 0) {
      const somaGrande = oleoFiltrado.reduce((acc, curr) => acc + (curr.tanqueGrande || 0), 0);
      this.mediaTanqueGrande = somaGrande / oleoFiltrado.length;
    } else {
      this.mediaTanqueGrande = 0;
    }

    // [LÓGICA CORRIGIDA AQUI]
    // Se houver pelo menos 1 registo (duplicado ou não), permite a edição/exclusão do primeiro.
    // Isso resolve o "deadlock" onde 2 registros impediam a exclusão.
    if (oleoFiltrado.length >= 1) {
      this.registroOleoAtual = oleoFiltrado[0];
    } else {
      this.registroOleoAtual = null;
    }
  }

  abrirRegistroOleo(): void {
    const dialogRef = this.dialog.open(OilExtractionDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { 
        registro: null,
        listaExistente: this.todosRegistosOleo 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) this.carregarDadosOleo();
    });
  }

  editarRegistroOleo(): void {
    if (!this.registroOleoAtual) return;

    const dialogRef = this.dialog.open(OilExtractionDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        registro: this.registroOleoAtual,
        listaExistente: this.todosRegistosOleo
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) this.carregarDadosOleo();
    });
  }

  apagarRegistroOleo(): void {
    if (!this.registroOleoAtual || !this.registroOleoAtual.id) return;

    if (confirm('Tem certeza que deseja apagar este registo de óleo?')) {
      this.oilService.deleteExtraction(this.registroOleoAtual.id).subscribe({
        next: () => {
          alert('Registo apagado.');
          this.carregarDadosOleo();
        },
        error: (err: any) => alert('Erro ao apagar.')
      });
    }
  }

  // --- LÓGICA DE FILTROS DE MÁQUINAS ---

  filtrarRelatorios(): void {
    if (!this.startDate || !this.endDate) {
      alert('Por favor, selecione as datas de início e fim.');
      return;
    }
    
    this.searchPerformed = true;
    this.isLoading = true; 

    this.filtrarOleo(); // Atualiza óleo
    
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

    this.filtrarOleo(); // Reseta óleo

    this.totalPages = Math.ceil(this.allReports.length / this.itemsPerPage);
    this.irParaPagina(1); 
    this.searchPerformed = false;
    this.calcularKPIs(this.allReports); 
  }

  // --- CÁLCULO DE KPIs DE MÁQUINAS ---

  calcularKPIs(reports: SingleReportData[]): void {
    const resetKPIs = () => {
      this.mediaTem2C = 0; this.mediaQ90h = 0; 
      this.mediaConz1Nivel = 0; this.mediaConz2Nivel = 0;
      this.mediaPre1Amp = 0; this.mediaPre2Amp = 0; 
      this.mediaPre3Amp = 0; this.mediaPre4Amp = 0;
    };

    if (!reports || reports.length === 0) {
      resetKPIs();
      return;
    }

    let reportsValidos = reports;

    // Filtro de Paradas (< 30A em 2+ máquinas)
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