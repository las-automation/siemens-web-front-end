import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { SingleReportData } from '../modal/single-report-data/single-report-data';

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
          // CORRIGIDO: Usa 'dataHora' (camelCase)
          const dt = report.dataHora; 
          const reportDate = new Date(dt[0], dt[1] - 1, dt[2], dt[3], dt[4], dt[5]);
          return reportDate >= startDate && reportDate <= endDate;
        });
      })
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    // ... sua função de tratamento de erros ...
    return throwError(() => new Error('Falha na comunicação com o servidor.'));
  }
}
