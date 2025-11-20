// Em: src/app/modal/single-report-data/single-report-data.ts

export interface SingleReportData {
  reportId: number;
  conz1Nivel: number | null; // É bom permitir null se o dado puder faltar
  conz2Nivel: number | null;
  
  // [A CORREÇÃO ESTÁ AQUI]
  // O teu Java envia LocalDateTime, que vira uma STRING.
  dataHora: string; 

  excelId: number;
  pre1Amp: number | null;
  pre2Amp: number | null;
  pre3Amp: number | null;
  pre4Amp: number | null;
  q90h: number | null;
  tem2C: number | null;
  usuario: string | null;
}