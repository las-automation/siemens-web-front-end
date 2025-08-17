import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SingleReportData } from '../modal/single-report-data/single-report-data';

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {
  private readonly API_URL = 'https://siemens-web-back-end.onrender.com/reports';

  constructor(private http: HttpClient) { }

  /**
   * ATUALIZADO: Este método agora busca relatórios do backend DENTRO de um intervalo de datas.
   * Esta é a nossa ÚNICA forma de buscar dados agora.
   */
  getReportsByDateRange(startDate: Date, endDate: Date): Observable<SingleReportData[]> {
    const token = localStorage.getItem('user_token');
    if (!token) {
      return throwError(() => new Error('Token de autenticação não encontrado.'));
    }

    // Formata as datas para o padrão YYYY-MM-DD, que é universal para APIs
    const startString = startDate.toISOString().split('T')[0];
    const endString = endDate.toISOString().split('T')[0];

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    // ATENÇÃO: O seu backend precisa de ter este endpoint
    const url = `${this.API_URL}/by-date-range?start=${startString}&end=${endString}`;

    console.log(`Serviço: A buscar relatórios do backend para o intervalo: ${startString} a ${endString}`);

    return this.http.get<SingleReportData[]>(url, { headers }).pipe(
      tap(reports => console.log(`Serviço: ${reports.length} relatórios recebidos do backend.`)),
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      console.error('Erro de Autenticação (401)! O token pode ser inválido ou ter expirado.', error);
    } else {
      console.error(`Erro na API! Código ${error.status}, body: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Falha na comunicação com o servidor.'));
  }
}
