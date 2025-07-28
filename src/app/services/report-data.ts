import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders  } from '@angular/common/http';
import { Observable, of, interval, map, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface DailyReportData {
  reportId: number;

  nomeMaquina: string;
  horasTrabalhadas: number;
  horasInativas: number;
  corrente: number;
  eficiencia: number;
  nivel: number;
  temperatura: number;
  status: string;
  diasTrabalhados: number;
  proximaManutencao: number;

  consumoCorrente: number;
}

export interface ReportHistory {
  id: string;
  data: string;
  resumo: string;
}

@Injectable({
  providedIn: 'root'
})


export class ReportDataService {
  private readonly API_URL = 'http://localhost:8080/reports';


  constructor(private http: HttpClient) {}


  // 1. MÉTODO PARA "BUSCAR" DADOS (GET)
  getDailyReport(): Observable<DailyReportData[]> {
    console.log('Serviço está a BUSCAR dados da API...');
    
    // 2. Pegamos o token que foi guardado no login
    const token = localStorage.getItem('user_token');

    if (!token) {
      console.error('Token não encontrado! O utilizador precisa de fazer login.');
    }
    // 3. Criamos o cabeçalho de autorização
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // 4. Enviamos a requisição com os cabeçalhos
    return this.http.get<DailyReportData[]>(this.API_URL, { headers }).pipe(
      tap(data => console.log('Dados recebidos da API:', data)),
      catchError(this.handleError)
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

  // 4. MÉTODO PARA "ATUALIZAR" DADOS (PUT)
  updateReport(reportId: number, report: DailyReportData): Observable<void> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    // Construímos a URL para o recurso específico, ex: /reports/1
    return this.http.put<void>(`${this.API_URL}/${reportId}`, report, { headers });
  }

  // 5. MÉTODO PARA "BUSCAR" HISTÓRICO DE RELATÓRIOS
  getReportHistory(): Observable<ReportHistory[]> {
    const historyData: ReportHistory[] = [
      { id: '20250714', data: '14/07/2025', resumo: 'Eficiência média: 98.2%. 2 Alertas registados.' },
      { id: '20250713', data: '13/07/2025', resumo: 'Eficiência média: 97.5%. 1 Alarme crítico.' },
      { id: '20250712', data: '12/07/2025', resumo: 'Eficiência média: 99.1%. Operação normal.' },
      { id: '20250711', data: '11/07/2025', resumo: 'Eficiência média: 96.8%. Parada para manutenção.' },
    ];
    return of(historyData);
  }
  getRealTimeCurrentData() {
    return interval(1500).pipe(
      map(() => 20 + (Math.random() * 10 - 5))
    );
  }
}
