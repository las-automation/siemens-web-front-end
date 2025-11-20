import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ReportDataService } from './report-data';
import { SingleReportData } from '../modal/single-report-data/single-report-data';

@Injectable({
  providedIn: 'root'
})
export class RealTimeDataService {

  constructor(private reportService: ReportDataService) { }

  getRealTimeCurrentData(): Observable<number> {
    return interval(2000).pipe(
      switchMap(() => this.reportService.getLatestReport()),
      map((report: SingleReportData | null) => {
        if (!report) {
          return 0;
        }
        
        // --- CORREÇÃO APLICADA ---
        // Usamos o 'nullish coalescing operator' (??)
        // para garantir que qualquer valor nulo ou undefined vire 0 ANTES da soma.
        const pre1 = report.pre1Amp ?? 0;
        const pre2 = report.pre2Amp ?? 0;
        const pre3 = report.pre3Amp ?? 0;
        const pre4 = report.pre4Amp ?? 0;
        
        return pre1 + pre2 + pre3 + pre4;
        // --- FIM DA CORREÇÃO ---
      })
    );
  }

  getRealTimeTemperatureData(): Observable<number> {
    return interval(2000).pipe(
      switchMap(() => this.reportService.getLatestReport()),
      map((report: SingleReportData | null) => {
        
        // --- CORREÇÃO APLICADA ---
        // A forma 'report ? report.tem2C : 0' falha se tem2C for null.
        // Usamos 'optional chaining' (?.) para acessar 'tem2C' de forma segura,
        // e 'nullish coalescing' (??) para definir 0 se for nulo.
        return report?.tem2C ?? 0;
        // --- FIM DA CORREÇÃO ---
      })
    );
  }
}