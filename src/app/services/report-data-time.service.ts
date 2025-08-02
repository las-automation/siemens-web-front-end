import { Injectable } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ReportDataService } from './report-data'; // 1. Importe o serviço principal

@Injectable({
  providedIn: 'root'
})
export class RealTimeDataService {

  // 2. Injete o ReportDataService para ter acesso aos dados da API
  constructor(private reportService: ReportDataService) { }

  /**
   * ATUALIZADO: Busca a corrente real da máquina a cada 2 segundos.
   */
  getRealTimeCurrentData(machineName: string): Observable<number> {
    return interval(2000).pipe(
      // A cada 2 segundos, busca a lista completa de relatórios
      switchMap(() => this.reportService.getDailyReport()),
      // "Mapeia" a lista para encontrar a nossa máquina e devolver apenas a sua corrente
      map(reports => {
        const machine = reports.find(r => r.nomeMaquina === machineName);
        // Se a máquina for encontrada, retorna a sua corrente; caso contrário, retorna 0
        return machine ? machine.corrente : 0;
      })
    );
  }

  /**
   * ATUALIZADO: Busca a temperatura real da máquina a cada 2 segundos.
   */
  getRealTimeTemperatureData(machineName: string): Observable<number> {
    return interval(2000).pipe(
      switchMap(() => this.reportService.getDailyReport()),
      map(reports => {
        const machine = reports.find(r => r.nomeMaquina === machineName);
        return machine ? machine.temperatura : 0;
      })
    );
  }
}
