// Ficheiro: src/app/pages/report-history/report-history.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Imports do Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// Imports do noso proxecto
import { ReportDataService, ReportHistory } from '../../services/report-data';

@Component({
  selector: 'app-report-history',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './report-history.html',
  styleUrl: './report-history.css'
})
export class ReportHistoryComponent implements OnInit {

  // As columnas que a nosa táboa irá exhibir
  displayedColumns: string[] = ['data', 'resumo', 'acoes'];
  // A nosa fonte de datos para a táboa
  dataSource: ReportHistory[] = [];

  constructor(private reportService: ReportDataService) {}

  ngOnInit(): void {
    this.reportService.getReportHistory().subscribe(data => {
      this.dataSource = data;
    });
  }

  verDetalhes(reportId: string) {
    // No futuro, isto navegará para a páxina de informe diario daquela data
    alert('A ver os detalles do informe: ' + reportId);
  }
}

