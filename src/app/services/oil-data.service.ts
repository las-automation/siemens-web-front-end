import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExtracaoOleo } from '../modal/extracao-oleo';

@Injectable({
  providedIn: 'root'
})
export class OilDataService {
  
  // URL do Backend
  private readonly API_URL = 'https://siemens-web-back-end.onrender.com/deojuvante/oil';

  constructor(private http: HttpClient) { }

  /**
   * 1. GET - Busca todos os registos de óleo.
   */
  getAllExtractions(): Observable<ExtracaoOleo[]> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    
    // O <ExtracaoOleo[]> tipa o retorno para que o componente saiba o formato
    return this.http.get<ExtracaoOleo[]>(this.API_URL, { headers });
  }

  /**
   * 2. POST - Salva um novo registo.
   */
  saveExtraction(data: ExtracaoOleo): Observable<void> {
    const token = localStorage.getItem('user_token');
    
    // Diagnóstico para garantir que o token e os dados estão saindo
    console.log('--- ENVIANDO POST (Salvar) ---');
    console.log('Payload:', data);
    
    const headers = new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<void>(this.API_URL, data, { headers });
  }

  /**
   * 3. PUT - Atualiza um registo existente.
   */
  updateExtraction(id: number, data: ExtracaoOleo): Observable<void> {
    const token = localStorage.getItem('user_token');
    
    console.log(`--- ENVIANDO PUT (Atualizar ID: ${id}) ---`);
    console.log('Payload:', data);

    const headers = new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<void>(`${this.API_URL}/${id}`, data, { headers });
  }

  /**
   * 4. DELETE - Apaga um registo.
   */
  deleteExtraction(id: number): Observable<void> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    
    console.log(`--- ENVIANDO DELETE (ID: ${id}) ---`);

    return this.http.delete<void>(`${this.API_URL}/${id}`, { headers });
  }
}