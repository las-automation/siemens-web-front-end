// Em: src/app/modal/single-report-data/single-report-data.ts
export interface SingleReportData {
  report_id: number;
  conz1_nivel: number;
  conz2_nivel: number;
  data_hora: number[]; // ATUALIZADO: De string para array de números
  excel_id: number;
  pre1_amp: number;
  pre2_amp: number;
  pre3_amp: number;
  pre4_amp: number;
  q90h: number;
  tem2_c: number;
  usuario: string;
}
