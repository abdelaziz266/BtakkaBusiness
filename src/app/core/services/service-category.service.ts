import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../models/shared.dto';
import { Observable } from 'rxjs';
import { IGetServiceCategoryDto } from '../models/serviceCategory.dto';

@Injectable({
  providedIn: 'root'
})
export class ServiceCategoryService {
  private apiUrl = environment.apiUrl + 'ServiceCategory/';
  
    constructor(private http: HttpClient) {}
  
    GetServiceCategories(): Observable<IApiResponse<IGetServiceCategoryDto[]>> {
      return this.http.get<IApiResponse<IGetServiceCategoryDto[]>>(
        `${this.apiUrl}GetServiceCategories`
      );
    }
}
