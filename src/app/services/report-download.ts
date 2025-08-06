import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver'; // 1. Precisamos de uma biblioteca para salvar ficheiros

@Injectable({
  providedIn: 'root'
})
export class ReportDownloadService {
  private readonly API_URL = 'http://localhost:8080/reports/history';

  constructor(private http: HttpClient) { }

  /**
   * Pede ao backend o PDF de um snapshot específico e inicia o download.
   */
  downloadSnapshotAsPdf(historyId: number): void {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    // Pedimos a resposta como um 'blob' (um ficheiro)
    this.http.get(`${this.API_URL}/${historyId}/pdf`, { headers, responseType: 'blob' })
      .subscribe(blob => {
        // Usa a biblioteca file-saver para iniciar o download no navegador
        saveAs(blob, `Relatorio_Historico_${historyId}.pdf`);
      });
  }
}