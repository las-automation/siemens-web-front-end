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
        // CORRIGIDO: Nomes de propriedade atualizados para camelCase
        return report.pre1Amp + report.pre2Amp + report.pre3Amp + report.pre4Amp;
      })
    );
  }

  getRealTimeTemperatureData(): Observable<number> {
    return interval(2000).pipe(
      switchMap(() => this.reportService.getLatestReport()),
      map((report: SingleReportData | null) => {
        // CORRIGIDO: Nome de propriedade atualizado para camelCase
        return report ? report.tem2C : 0;
      })
    );
  }
}
