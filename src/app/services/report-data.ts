import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, interval, map, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { HistoryDetailsModal } from '../modal/history-details-modal/history-details-modal';
import { DailyReportData } from '../modal/daily-report-data/daily-report-data';

// Interface para mapear a resposta da API que pode ter nomes de propriedade inconsistentes
interface ReportApiResponse {
  reportId?: number;
  report_id?: number;
  nomeMaquina?: string;
  nome_maquina?: string;
  horasTrabalhadas?: number;
  horas_trabalhadas?: number;
  horasInativas?: number;
  horas_inativas?: number;
  corrente?: number;
  eficiencia?: number;
  nivel?: number;
  temperatura?: number;
  status?: string;
  diasTrabalhados?: number;
  dias_trabalhados?: number;
  proximaManutencao?: number;
  proxima_manutencao?: number;
  consumoCorrente?: number;
  consumo_energia?: number;
}

export interface SnapshotResponse {
  historyId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {
  private readonly API_URL = 'https://siemens-web-back-end.onrender.com/reports';

  constructor(private http: HttpClient) { }

  // --- MÉTODOS EXISTENTES ---

  getDailyReport(): Observable<DailyReportData[]> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<ReportApiResponse[]>(this.API_URL, { headers }).pipe(
      map(apiResponse => {
        if (!apiResponse) return [];
        
        return apiResponse.map(item => ({
          reportId: item.reportId || item.report_id || 0,
          nomeMaquina: item.nomeMaquina || item.nome_maquina || 'Nome Indisponível',
          horasTrabalhadas: item.horasTrabalhadas || item.horas_trabalhadas || 0,
          horasInativas: item.horasInativas || item.horas_inativas || 0,
          corrente: item.corrente || 0,
          eficiencia: item.eficiencia || 0,
          nivel: item.nivel || 0,
          temperatura: item.temperatura || 0,
          status: item.status || 'Desconhecido',
          diasTrabalhados: item.diasTrabalhados || item.dias_trabalhados || 0,
          proximaManutencao: item.proximaManutencao || item.proxima_manutencao || 0,
          consumoCorrente: item.consumoCorrente || item.consumo_energia || 0
        }));
      }),
      catchError(this.handleError) // Adicionado tratamento de erro aqui também
    );
  }

  createReport(report: DailyReportData): Observable<void> {
    console.log('Serviço está a ARMAZENAR dados na API...', report);
    
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<void>(this.API_URL, report, { headers }).pipe(
      tap(() => console.log('Dados armazenados com sucesso!')),
      catchError(this.handleError)
    );
  }

  getReportHistory(): Observable<HistoryDetailsModal[]> {
    console.log('A buscar dados mocados do histórico...');
    const mockHistory: HistoryDetailsModal[] = [
      { id: '20250714', data: '14/07/2025', resumo: 'Eficiência média: 98.2%. 2 Alertas registados.' },
      { id: '20250713', data: '13/07/2025', resumo: 'Eficiência média: 97.5%. 1 Alarme crítico.' },
      { id: '20250712', data: '12/07/2025', resumo: 'Eficiência média: 99.1%. Operação normal.' }
    ];
    return of(mockHistory);
  }

  saveReportSnapshot(reportData: DailyReportData[]): Observable<SnapshotResponse> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<SnapshotResponse>(`${this.API_URL}/history`, reportData, { headers });
  }

  getRealTimeCurrentData() {
    return interval(1500).pipe(
      map(() => 20 + (Math.random() * 10 - 5))
    );
  }

  // --- NOVO MÉTODO ADICIONADO ---

  /**
   * Busca um registo de relatório específico com base numa data e hora.
   * @param dateTimeString Uma string representando a data e hora (ex: '2025-08-15 10:00:00').
   * @returns Um Observable que emite os dados do relatório encontrado.
   */
  getReportByDateTime(dateTimeString: string): Observable<any> {
    // 1. Log para depuração: Informa que a função foi chamada.
    console.log(`Serviço: A iniciar busca para a data/hora: ${dateTimeString}`);

    // 2. Obtenção do token de autenticação, essencial para a segurança.
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    // 3. Codificação da data/hora para uma URL segura.
    const encodedDateTime = encodeURIComponent(dateTimeString);

    // 4. Construção da URL final para a API.
    const url = `${this.API_URL}/by-date/${encodedDateTime}`;
    console.log(`Serviço: URL do pedido GET: ${url}`);

    // 5. Execução do pedido HTTP GET.
    return this.http.get<any>(url, { headers }).pipe(
      tap(data => {
        console.log('Serviço: Resposta da API recebida com sucesso.', data);
      }),
      catchError(this.handleError) // Reutiliza a função de tratamento de erros
    );
  }


  // --- FUNÇÃO PRIVADA DE TRATAMENTO DE ERROS ---

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      console.error('Erro de Autenticação! O token pode ser inválido ou ter expirado.', error);
    } else {
      console.error(`Ocorreu um erro na comunicação com a API! Código ${error.status}, ` + `body: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Falha na comunicação com o servidor. Por favor, tente novamente mais tarde.'));
  }
}
