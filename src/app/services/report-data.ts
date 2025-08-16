import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { SingleReportData } from '../modal/single-report-data/single-report-data';
import { HistoryDetailsModal } from '../modal/history-details-modal/history-details-modal'; // Import adicionado

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {
  private readonly API_URL = 'https://siemens-web-back-end.onrender.com/reports';

  private reportsCache$ = new BehaviorSubject<SingleReportData[]>([]);

  constructor(private http: HttpClient) { }

  loadAllReports(): Observable<SingleReportData[]> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<SingleReportData[]>(this.API_URL, { headers }).pipe(
      tap(reports => {
        this.reportsCache$.next(reports);
        console.log(`Serviço: ${reports.length} relatórios carregados e guardados no cache.`);
      }),
      catchError(this.handleError)
    );
  }

  getLatestReport(): Observable<SingleReportData | null> {
    return this.reportsCache$.pipe(
      map(reports => (!reports || reports.length === 0) ? null : reports[0])
    );
  }

  getReportsByDateRange(startDate: Date, endDate: Date): Observable<SingleReportData[]> {
    return this.reportsCache$.pipe(
      map(allReports => {
        if (!allReports) return [];
        endDate.setHours(23, 59, 59, 999);
        return allReports.filter(report => {
          const dt = report.data_hora;
          const reportDate = new Date(dt[0], dt[1] - 1, dt[2], dt[3], dt[4], dt[5]);
          return reportDate >= startDate && reportDate <= endDate;
        });
      })
    );
  }
  
  /**
   * CORRIGIDO: Método adicionado de volta para compatibilidade com a página de histórico.
   */
  getReportHistory(): Observable<HistoryDetailsModal[]> {
    console.log('A buscar dados mocados do histórico...');
    const mockHistory: HistoryDetailsModal[] = [
        { id: '20250714', data: '14/07/2025', resumo: 'Eficiência média: 98.2%.' },
    ];
    return of(mockHistory);
  }

  private handleError(error: HttpErrorResponse) {
    // ... sua função de tratamento de erros ...
    return throwError(() => new Error('Falha na comunicação com o servidor.'));
  }
}