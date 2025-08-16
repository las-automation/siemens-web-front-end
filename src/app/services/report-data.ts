import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Imports necessários
import { SingleReportData } from '../modal/single-report-data/single-report-data';
import { HistoryDetailsModal } from '../modal/history-details-modal/history-details-modal';

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {
  private readonly API_URL = 'https://siemens-web-back-end.onrender.com/reports';

  constructor(private http: HttpClient) { }

  /**
   * Busca apenas o último registo da tabela de relatórios.
   * @returns Um Observable que emite um único objeto SingleReportData.
   */
  getLatestReport(): Observable<SingleReportData> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const latestReportUrl = `${this.API_URL}/latest`;

    return this.http.get<SingleReportData>(latestReportUrl, { headers }).pipe(
      tap(data => console.log('Serviço: Último relatório recebido:', data)),
      catchError(this.handleError)
    );
  }
  
  /**
   * Busca um registo de relatório específico com base numa data e hora.
   * @param dateTimeString Uma string representando a data e hora.
   * @returns Um Observable que emite os dados do relatório encontrado.
   */
  getReportByDateTime(dateTimeString: string): Observable<SingleReportData> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const encodedDateTime = encodeURIComponent(dateTimeString);
    const url = `${this.API_URL}/by-date/${encodedDateTime}`;
    
    return this.http.get<SingleReportData>(url, { headers }).pipe(
      tap(data => console.log(`Serviço: Relatório para ${dateTimeString} recebido.`, data)),
      catchError(this.handleError)
    );
  }

  /**
   * Busca um histórico mockado de relatórios.
   */
  getReportHistory(): Observable<HistoryDetailsModal[]> {
    console.log('A buscar dados mocados do histórico...');
    const mockHistory: HistoryDetailsModal[] = [
      { id: '20250714', data: '14/07/2025', resumo: 'Eficiência média: 98.2%. 2 Alertas registados.' },
      { id: '20250713', data: '13/07/2025', resumo: 'Eficiência média: 97.5%. 1 Alarme crítico.' },
    ];
    return of(mockHistory);
  }

  /**
   * Função privada para tratamento centralizado de erros de HTTP.
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      console.error('Erro de Autenticação! O token pode ser inválido ou ter expirado.', error);
    } else {
      console.error(`Ocorreu um erro na comunicação com a API! Código ${error.status}, ` + `body: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Falha na comunicação com o servidor. Por favor, tente novamente mais tarde.'));
  }
}
