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

  getLatestReport(): Observable<SingleReportData> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<SingleReportData[]>(this.API_URL, { headers }).pipe(
      map(reports => (!reports || reports.length === 0) ? null as any : reports[0]),
      tap(data => console.log('Serviço: Primeiro relatório da lista recebido:', data)),
      catchError(this.handleError)
    );
  }

  /**
   * CORRIGIDO: Busca TODOS os relatórios e os filtra por data/hora no FRONTEND,
   * entendendo que a data vem como um array de números.
   */
  getReportsByDateTimeRange(startDateTime: string, endDateTime: string): Observable<SingleReportData[]> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<SingleReportData[]>(this.API_URL, { headers }).pipe(
      map(allReports => {
        if (!allReports) return [];

        const startDate = new Date(startDateTime);
        const endDate = new Date(endDateTime);

        return allReports.filter(report => {
          // Converte o array da API para um objeto Date do JavaScript
          const dt = report.data_hora;
          // new Date(ano, mês - 1, dia, hora, minuto, segundo)
          const reportDate = new Date(dt[0], dt[1] - 1, dt[2], dt[3], dt[4], dt[5]);
          
          return reportDate >= startDate && reportDate <= endDate;
        });
      }),
      tap(filteredData => console.log(`Serviço: ${filteredData.length} relatórios encontrados (filtro no frontend).`)),
      catchError(this.handleError)
    );
  }
  
  /**
   * CORRIGIDO: Método adicionado de volta para compatibilidade.
   */
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
      console.error(`Erro na API! Código ${error.status}, body: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Falha na comunicação com o servidor.'));
  }
}
