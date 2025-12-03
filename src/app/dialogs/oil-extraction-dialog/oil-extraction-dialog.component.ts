import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { OilDataService } from '../../services/oil-data.service';
import { ExtracaoOleo } from '../../modal/extracao-oleo'; 

@Component({
  selector: 'app-oil-extraction-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatRadioModule, MatDatepickerModule, 
    MatNativeDateModule, MatIconModule, MatDividerModule
  ],
  templateUrl: './oil-extraction-dialog.component.html',
  styleUrl: './oil-extraction-dialog.component.css',
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
      ...(this.isEditMode && this.currentId ? { id: this.currentId } : {}),
      tanquesCompletos: Number(this.qtdCheios),
      alturaIncompletoCm: alturaFinal,
      tanqueGrande: Number(this.tanqueGrande),
      turno: Number(this.turno),
      dataExtracao: dataFormatada
    };

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