import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { SingleReportData } from '../modal/single-report-data/single-report-data';
import { HistoryDetailsModal } from '../modal/history-details-modal/history-details-modal';

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {
  private readonly API_URL = 'https://siemens-web-back-end.onrender.com/reports';

  constructor(private http: HttpClient) { }

  /**
   * Busca a lista completa e retorna o primeiro item.
   */
  getLatestReport(): Observable<SingleReportData> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<SingleReportData[]>(this.API_URL, { headers }).pipe(
      map(reports => {
        if (!reports || reports.length === 0) {
          return null as any;
        }
        return reports[0];
      }),
      tap(data => console.log('Serviço: Primeiro relatório da lista recebido:', data)),
      catchError(this.handleError)
    );
  }
  
  /**
   * Busca um relatório específico por data e hora (requer endpoint no backend).
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
   * ATUALIZADO: Busca TODOS os relatórios e os filtra por data/hora no FRONTEND.
   * @param startDateTime A data e hora de início no formato 'YYYY-MM-DD HH:MM:SS'.
   * @param endDateTime A data e hora de fim no formato 'YYYY-MM-DD HH:MM:SS'.
   * @returns Um Observable que emite um array de relatórios filtrados.
   */
  getReportsByDateTimeRange(startDateTime: string, endDateTime: string): Observable<SingleReportData[]> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    // 1. Busca o array COMPLETO de relatórios, que a sua API já fornece.
    return this.http.get<SingleReportData[]>(this.API_URL, { headers }).pipe(
      map(allReports => {
        if (!allReports) {
          return []; // Retorna array vazio se a resposta da API for nula.
        }

        // 2. Converte as strings do filtro para objetos Date para uma comparação segura.
        const startDate = new Date(startDateTime);
        const endDate = new Date(endDateTime);

        // 3. Filtra o array aqui mesmo, no frontend.
        return allReports.filter(report => {
          const reportDate = new Date(report.data_hora);
          // A condição retorna 'true' apenas para os relatórios dentro do intervalo.
          return reportDate >= startDate && reportDate <= endDate;
        });
      }),
      tap(filteredData => console.log(`Serviço: ${filteredData.length} relatórios encontrados no intervalo (filtro no frontend).`)),
      catchError(this.handleError)
    );
  }

  getReportHistory(): Observable<HistoryDetailsModal[]> {
    console.log('A buscar dados mocados do histórico...');
    const mockHistory: HistoryDetailsModal[] = [
        { id: '20250714', data: '14/07/2025', resumo: 'Eficiência média: 98.2%.' },
    ];
    return of(mockHistory);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      console.error('Erro de Autenticação! O token pode ser inválido ou ter expirado.', error);
    } else {
      console.error(`Ocorreu um erro na comunicação com a API! Código ${error.status}, ` + `body: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Falha na comunicação com o servidor. Por favor, tente novamente mais tarde.'));
  }
}
