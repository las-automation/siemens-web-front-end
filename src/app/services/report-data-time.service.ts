import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ReportDataService } from './report-data'; // 1. Importe o serviço principal
import { SingleReportData } from '../modal/single-report-data/single-report-data'; // 2. Importe a nova interface

@Injectable({
  providedIn: 'root'
})
export class RealTimeDataService {

  constructor(private reportService: ReportDataService) { }

  /**
   * REATORIZADO: Busca a SOMA DAS CORRENTES do último relatório a cada 2 segundos.
   * O parâmetro 'machineName' não é mais necessário, pois sempre pegamos os dados do último registo.
   */
  getRealTimeCurrentData(): Observable<number> {
    return interval(2000).pipe(
      // A cada 2 segundos, busca o último relatório completo
      switchMap(() => this.reportService.getLatestReport()),
      // "Mapeia" o objeto do relatório para calcular e devolver a soma das correntes
      map((report: SingleReportData) => {
        // Se o relatório não existir, retorna 0
        if (!report) {
          return 0;
        }
        // Soma as correntes de todas as fases (pre1_amp, pre2_amp, etc.)
        return report.pre1_amp + report.pre2_amp + report.pre3_amp + report.pre4_amp;
      })
    );
  }

  /**
   * REATORIZADO: Busca a TEMPERATURA do último relatório a cada 2 segundos.
   */
  getRealTimeTemperatureData(): Observable<number> {
    return interval(2000).pipe(
      // A cada 2 segundos, busca o último relatório completo
      switchMap(() => this.reportService.getLatestReport()),
      // Mapeia o objeto do relatório para devolver apenas a sua temperatura
      map((report: SingleReportData) => {
        // Se o relatório for encontrado, retorna a sua temperatura; caso contrário, retorna 0
        return report ? report.tem2_c : 0;
      })
    );
  }
}
