import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAddCostCenter } from '../models/costCenter.dto';

@Injectable({
  providedIn: 'root'
})
export class CostCenterService {
  private apiUrl = environment.apiUrl + 'CostCenter/';

  constructor(private http: HttpClient) { }
  
  GetCostCenterById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}get/${id}`);
  }

  GetCostCenter(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}get`, {
      params: {
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  createCostCenter(costCenterData: IAddCostCenter): Observable<any> {
    return this.http.post(`${this.apiUrl}create-cost-center`, costCenterData);
  }

  update(id: number, costCenterData: IAddCostCenter): Observable<any> {
    return this.http.put(`${this.apiUrl}update/${id}`, costCenterData);
  }

  deleteCostCenter(costCenterId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delete/${costCenterId}`);
  }
}
