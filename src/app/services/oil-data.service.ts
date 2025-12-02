import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExtracaoOleo } from '../modal/extracao-oleo';

@Injectable({
  providedIn: 'root'
})
export class OilDataService {
  // Ajuste a URL se necessário (ex: localhost ou vercel)
  private readonly API_URL = 'https://siemens-web-back-end.onrender.com/deojuvante/oil';

  constructor(private http: HttpClient) { }

  /**
   * Salva um novo registo de extração de óleo.
   */

  updateExtraction(id: number, data: ExtracaoOleo): Observable<void> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.put<void>(`${this.API_URL}/${id}`, data, { headers });
  }

  // [NOVO] Apagar
  deleteExtraction(id: number): Observable<void> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.delete<void>(`${this.API_URL}/${id}`, { headers });
  }
  
  saveExtraction(data: ExtracaoOleo): Observable<void> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<void>(this.API_URL, data, { headers });
  }

  /**
   * [CORREÇÃO] Este método estava a faltar e causava o erro TS2339.
   * Busca todos os registos de óleo do backend.
   */
  getAllExtractions(): Observable<ExtracaoOleo[]> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    // O <ExtracaoOleo[]> diz ao TypeScript que a resposta é uma lista, resolvendo o erro de tipo
    return this.http.get<ExtracaoOleo[]>(this.API_URL, { headers });
  }
}