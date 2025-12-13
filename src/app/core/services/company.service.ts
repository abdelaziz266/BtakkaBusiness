import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = environment.apiUrl + 'Company/';

  constructor(private http: HttpClient) { }
  GetCompanyById(id: number): Observable<any> {
    
    return this.http.get(`${this.apiUrl}get/${id}`);
  }

  GetCompany(): Observable<any> {
    
    return this.http.get(`${this.apiUrl}get`);
  }

  // new: create company endpoint (expects FormData)
  createCompany(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}create-company`, formData);
  }
update(id: number,formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}update/${id}`, formData);
  }

  deleteCompany(companyId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delete/${companyId}`);
  }
}
