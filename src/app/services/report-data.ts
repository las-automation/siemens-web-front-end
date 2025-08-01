import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders  } from '@angular/common/http';
import { Observable, of, interval, map, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { HistoryDetailsModal } from '../modal/history-details-modal/history-details-modal';
import { DailyReportData } from '../modal/daily-report-data/daily-report-data';

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

@Injectable({
  providedIn: 'root'
})

export class ReportDataService {
  private readonly API_URL = 'http://localhost:8080/reports';

  constructor(private http: HttpClient) { }

  getDailyReport(): Observable<DailyReportData[]> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<ReportApiResponse[]>(this.API_URL, { headers }).pipe(
      // Usamos o 'map' para "traduzir" e limpar os dados
      map(apiResponse => {
        if (!apiResponse) return []; // Se a resposta for nula, retorna um array vazio
        
        return apiResponse.map(item => ({
          // A lógica '||' garante que pegamos o valor, não importa o nome da propriedade
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
          // AQUI ESTÁ A TRADUÇÃO que resolve o bug do NaN
          consumoCorrente: item.consumoCorrente || item.consumo_energia || 0
        }));
      })
    );
  }

  // 2. MÉTODO PARA "ARMAZENAR" DADOS (POST)
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

  // 3. Função para tratamento de erros
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      console.error('Erro de Autenticação! O token pode ser inválido ou ter expirado.', error);
      // Opcional: redirecionar para a página de login
      // window.location.href = '/login';
    } else {
      console.error('Ocorreu um erro na comunicação com a API!', error);
    }
    return throwError(() => new Error('Falha na comunicação com o servidor. Tente novamente.'));
  }

  // 5. MÉTODO PARA "BUSCAR" HISTÓRICO DE RELATÓRIOS
  getReportHistory(): Observable<HistoryDetailsModal[]> {
    console.log('A buscar dados mocados do histórico...');
    const mockHistory: HistoryDetailsModal[] = [
      { id: '20250714', data: '14/07/2025', resumo: 'Eficiência média: 98.2%. 2 Alertas registados.' },
      { id: '20250713', data: '13/07/2025', resumo: 'Eficiência média: 97.5%. 1 Alarme crítico.' },
      { id: '20250712', data: '12/07/2025', resumo: 'Eficiência média: 99.1%. Operação normal.' }
    ];
    return of(mockHistory);
  }

  saveReportSnapshot(reportData: DailyReportData[]): Observable<void> {
    console.log('A simular o salvamento do snapshot:', reportData);
    return of(undefined); 
  }

  getRealTimeCurrentData() {
    return interval(1500).pipe(
      map(() => 20 + (Math.random() * 10 - 5))
    );
  }
}
