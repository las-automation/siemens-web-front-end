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
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './oil-extraction-dialog.component.html',
  styleUrl: './oil-extraction-dialog.component.css',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }]
})
export class OilExtractionDialogComponent implements OnInit {

  // Dados do Formulário
  public dataRegistro: Date = new Date();
  public turno: number = 1;
  public qtdCheios: number = 0;
  
  // Controle visual e lógica
  public temIncompleto: string = 'nao';
  public alturaIncompleto: number | null = null;
  public tanqueGrande: number | null = null;
  public isSaving: boolean = false;

  // Variáveis de Controle de Edição
  public isEditMode: boolean = false;
  public currentId: number | null = null;

  constructor(
    private dialogRef: MatDialogRef<OilExtractionDialogComponent>,
    private oilService: OilDataService,
    // [IMPORTANTE] Injetamos os dados passados ao abrir o modal (se houver)
    @Inject(MAT_DIALOG_DATA) public data: ExtracaoOleo | null
  ) {}

  ngOnInit(): void {
    // Se 'data' existir, estamos no modo de EDIÇÃO
    if (this.data) {
      this.isEditMode = true;
      this.currentId = this.data.id || null;
      
      // Preenche os campos com os dados existentes
      this.qtdCheios = this.data.tanquesCompletos;
      this.tanqueGrande = this.data.tanqueGrande;
      this.turno = this.data.turno;
      
      // Converte a string 'YYYY-MM-DD' de volta para objeto Date
      // Adicionamos 'T00:00:00' para evitar problemas de fuso horário ao converter
      if (this.data.dataExtracao) {
        this.dataRegistro = new Date(this.data.dataExtracao + 'T00:00:00');
      }

      // Lógica do tanque incompleto
      if (this.data.alturaIncompletoCm && this.data.alturaIncompletoCm > 0) {
        this.temIncompleto = 'sim';
        this.alturaIncompleto = this.data.alturaIncompletoCm;
      }
    }
  }

  salvar(): void {
    if (this.tanqueGrande === null) {
      alert("Preencha o nível do Tanque Grande.");
      return;
    }

    let alturaFinal = 0;
    if (this.temIncompleto === 'sim') {
      if (this.alturaIncompleto === null || this.alturaIncompleto === undefined) {
        alert("Digite a altura do tanque incompleto.");
        return;
      }
      alturaFinal = this.alturaIncompleto;
    }

    this.isSaving = true;

    // Monta o objeto para enviar
    const payload: ExtracaoOleo = {
      // Se for edição, mantém o ID
      ...(this.isEditMode && this.currentId ? { id: this.currentId } : {}),
      tanquesCompletos: this.qtdCheios,
      alturaIncompletoCm: alturaFinal,
      tanqueGrande: this.tanqueGrande,
      turno: this.turno,
      dataExtracao: this.dataRegistro.toISOString().split('T')[0]
    };

    // Decide qual método chamar no serviço
    const request$ = this.isEditMode && this.currentId
      ? this.oilService.updateExtraction(this.currentId, payload) // PUT
      : this.oilService.saveExtraction(payload); // POST

    request$.subscribe({
      next: () => {
        alert(this.isEditMode ? "Atualizado com sucesso!" : "Salvo com sucesso!");
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        alert("Erro ao processar dados.");
        this.isSaving = false;
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}