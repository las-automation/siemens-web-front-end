import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExtracaoOleo } from '../modal/extracao-oleo';

@Injectable({
  providedIn: 'root'
})
export class OilService {
  private readonly API_URL = 'https://siemens-web-back-end.onrender.com/deojuvante/oil';

  constructor(private http: HttpClient) { }

  saveExtraction(data: ExtracaoOleo): Observable<void> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<void>(this.API_URL, data, { headers });
  }

  getAllExtractions(): Observable<ExtracaoOleo[]> {
    const token = localStorage.getItem('user_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<ExtracaoOleo[]>(this.API_URL, { headers });
  }
}