import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, map } from 'rxjs';

export interface DailyReportData {
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
}

@Injectable({
  providedIn: 'root'
})


export class ReportDataService {
  private readonly API_URL = 'http://localhost:8080/reports';

  constructor(private http: HttpClient) {}

  getDailyReport(): Observable<DailyReportData[]> {
    return this.http.get<DailyReportData[]>(this.API_URL);
  }

  getReportHistory(): Observable<DailyReportData[]> {
    return this.getDailyReport(); // mesma chamada
  }

  getRealTimeCurrentData() {
    return interval(1500).pipe(
      map(() => 20 + (Math.random() * 10 - 5))
    );
  }
}
