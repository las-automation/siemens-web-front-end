import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { SingleReportData } from '../modal/single-report-data/single-report-data';
// Removi o HistoryDetailsModal porque não o estamos a usar
// import { HistoryDetailsModal } from '../modal/history-details-modal/history-details-modal';

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {
  // [CORREÇÃO] A API_URL base não deve ter /reports no final
  private readonly API_BASE_URL = 'https://siemens-web-back-end.onrender.com/deojuvante';
  private reportsCache$ = new BehaviorSubject<SingleReportData[]>([]);

  constructor(private http: HttpClient) { }

  /**
   * Método principal: Busca todos os relatórios da API e guarda no cache.
   */
  loadAllReports(): Observable<SingleReportData[]> {
    const token = localStorage.getItem('user_token');
    if (!token) {
      return throwError(() => new Error('Token de autenticação não encontrado.'));
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    // Usa a URL base + /reports
    return this.http.get<SingleReportData[]>(`${this.API_BASE_URL}/reports`, { headers }).pipe(
      tap(reports => {
        this.reportsCache$.next(reports);
        // Este console.log já tens, mas confirma que está a funcionar
        console.log(`Serviço: ${reports.length} relatórios carregados e guardados no cache.`);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Retorna o relatório mais recente a partir do cache.
   */
  getLatestReport(): Observable<SingleReportData | null> {
    return this.reportsCache$.pipe(
      map(reports => (!reports || reports.length === 0) ? null : reports[0])
    );
  }

  /**
   * [CORREÇÃO] Filtra os relatórios que já estão no cache.
   * Lógica alterada para tratar 'dataHora' como STRING.
   */
  getReportsByDateRange(startDate: Date, endDate: Date): Observable<SingleReportData[]> {
    return this.reportsCache$.pipe(
      map(allReports => {
        if (!allReports) return [];
        
        endDate.setHours(23, 59, 59, 999); 
        
        return allReports.filter(report => {
          
          // 1. 'dataHora' é uma string
          const dataString = report.dataHora; 
          if (!dataString) return false;

          // 2. Converte a string (ex: "2025-02-28T20:38:38") para Data
          const reportDate = new Date(dataString); 

          // 3. Verifica se é válida
          if (isNaN(reportDate.getTime())) {
            console.warn(`Serviço: Data inválida ignorada no filtro: ${dataString}`);
            return false;
          }
          
          // 4. Compara
          return reportDate >= startDate && reportDate <= endDate;
        });
      })
    );
  }

  /* * [RECOMENDAÇÃO FUTURA]
   * O teu backend tem um endpoint /reports/by-date.
   * Seria muito mais rápido chamares esse endpoint em vez de
   * usares o getReportsByDateRange (que filtra 17k no telemóvel/browser).
   * Mas, por agora, a solução acima (filtrar no cache) vai funcionar.
   */
  
  
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      console.error('Erro de Autenticação (401)! O token pode ser inválido ou ter expirado.', error);
    } else {
      console.error(`Erro na API! Código ${error.status}, body: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Falha na comunicação com o servidor.'));
  }
}