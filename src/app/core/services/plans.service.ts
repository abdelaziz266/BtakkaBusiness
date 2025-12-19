import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGetPlansDTO, IAddPlansDTO } from '../models/plans.dto';
import { IApiResponse } from '../models/shared.dto';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PlansService {
  private apiUrl = `${environment.apiUrl}Plan`;

  constructor(private http: HttpClient) { }

  // Get all plans
  getPlans(): Observable<IApiResponse<IGetPlansDTO[]>> {
    return this.http.get<IApiResponse<IGetPlansDTO[]>>(`${this.apiUrl}/get`);
  }

  // Get single plan by id
  getPlanById(id: number): Observable<IApiResponse<IGetPlansDTO>> {
    return this.http.get<IApiResponse<IGetPlansDTO>>(`${this.apiUrl}/get/${id}`);
  }

  // Create new plan
  createPlan(plan: IAddPlansDTO): Observable<IApiResponse<IGetPlansDTO>> {
    return this.http.post<IApiResponse<IGetPlansDTO>>(`${this.apiUrl}/create-plan`, plan);
  }

  // Update plan
  updatePlan(id: string, plan: IAddPlansDTO): Observable<IApiResponse<IGetPlansDTO>> {
    return this.http.put<IApiResponse<IGetPlansDTO>>(`${this.apiUrl}/update?Id=${id}&lang=en`, plan);
  }

  // Delete plan
  deletePlan(id: string): Observable<IApiResponse<any>> {
    return this.http.delete<IApiResponse<any>>(`${this.apiUrl}/delete?Id=${id}&lang=en`);
  }
}
