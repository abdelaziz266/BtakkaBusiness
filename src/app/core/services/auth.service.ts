import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILogin } from '../models/auth.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + 'Auth/';

  constructor(private http: HttpClient) { }
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }
  login(userName: string, password: string): Observable<any> {
    const body: ILogin = {
      userName,
      password
    }; 
    return this.http.post(`${this.apiUrl}login`, body, {
      headers: { 'Skip-Interceptor': 'true' }
    });
  }

}
