import { Component } from '@angular/core';

@Component({
  selector: 'app-history-details-modal',
  imports: [],
  templateUrl: './history-details-modal.html',
  styleUrl: './history-details-modal.css'
})
export class HistoryDetailsModal {

}

export interface ReportHistory {
  id: string; // O ID virá da base de dados
  data: string; // A data em que o snapshot foi salvo
  resumo: string; // Um resumo rápido (ex: "3 Alertas, Eficiência 95%")
}
