import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
export class OilExtractionDialogComponent {

  public dataRegistro: Date = new Date();
  public turno: number = 1;
  public qtdCheios: number = 0;
  
  public temIncompleto: string = 'nao';
  public alturaIncompleto: number | null = null;
  public tanqueGrande: number | null = null;
  public isSaving: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<OilExtractionDialogComponent>,
    private oilService: OilDataService
  ) {}

  salvar(): void {
    if (this.tanqueGrande === null) {
      alert("Preencha o nível do Tanque Grande.");
      return;
    }

    let alturaFinal = 0;
    if (this.temIncompleto === 'sim') {
      if (!this.alturaIncompleto) {
        alert("Digite a altura do tanque incompleto.");
        return;
      }
      alturaFinal = this.alturaIncompleto;
    }

    this.isSaving = true;

    const payload: ExtracaoOleo = {
      tanquesCompletos: this.qtdCheios,
      alturaIncompletoCm: alturaFinal,
      tanqueGrande: this.tanqueGrande,
      turno: this.turno,
      dataExtracao: this.dataRegistro.toISOString().split('T')[0]
    };

    this.oilService.saveExtraction(payload).subscribe({
      next: () => {
        alert("Salvo com sucesso!");
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        alert("Erro ao salvar.");
        this.isSaving = false;
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}