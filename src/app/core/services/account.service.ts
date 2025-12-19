import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAddAccount } from '../models/account.dto';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.apiUrl + 'Account/';

  constructor(private http: HttpClient) { }
  
  GetAccountById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}get/${id}`);
  }

  GetAccount(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}get`, {
      params: {
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  // Create account endpoint
  createAccount(accountData: IAddAccount): Observable<any> {
    return this.http.post(`${this.apiUrl}create-account`, accountData);
  }

  update(id: number, accountData: IAddAccount): Observable<any> {
    return this.http.put(`${this.apiUrl}update/${id}`, accountData);
  }

  deleteAccount(accountId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delete/${accountId}`);
  }
}
