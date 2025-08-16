import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ReportDataService } from './report-data'; // Corrigido o caminho
import { SingleReportData } from '../modal/single-report-data/single-report-data';

@Injectable({
  providedIn: 'root'
})
export class RealTimeDataService {

  constructor(private reportService: ReportDataService) { }

  getRealTimeCurrentData(): Observable<number> {
    return interval(2000).pipe(
      switchMap(() => this.reportService.getLatestReport()),
      // CORRIGIDO: O tipo do parâmetro 'report' agora pode ser 'null'
      map((report: SingleReportData | null) => {
        if (!report) {
          return 0;
        }
        return report.pre1_amp + report.pre2_amp + report.pre3_amp + report.pre4_amp;
      })
    );
  }

  getRealTimeTemperatureData(): Observable<number> {
    return interval(2000).pipe(
      switchMap(() => this.reportService.getLatestReport()),
      // CORRIGIDO: O tipo do parâmetro 'report' agora pode ser 'null'
      map((report: SingleReportData | null) => {
        return report ? report.tem2_c : 0;
      })
    );
  }
}
