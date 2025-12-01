export interface ExtracaoOleo {
  id?: number;
  tanquesCompletos: number;
  alturaIncompletoCm: number; // 0 se não houver incompleto
  tanqueGrande: number;
  turno: number;
  dataExtracao: string; // YYYY-MM-DD
}