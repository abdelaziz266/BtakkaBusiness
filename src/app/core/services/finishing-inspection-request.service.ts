import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { IApiResponse, IApiResponseWithList } from '../models/shared.dto';
import { IGetFinishingInspectionRequest } from '../models/FinishingInspectionRequest.dto';

export interface IGetFinishingInspectionRequestParams {
  pageNumber?: number;
  lang?: 'en' | 'ar' | 'all';
  rowCount?: number;
  requestStatus?: boolean;
  From?: string;
  To?: string;
  textSearch?: string;
}
@Injectable({
  providedIn: 'root'
})
export class FinishingInspectionRequestService {
  private apiUrl = `${environment.apiUrl}FinishingInspection`;

  constructor(private http: HttpClient) { }

  // Get finishing inspection requests with filters
  getFinishingInspectionRequests(params: IGetFinishingInspectionRequestParams): Observable<IApiResponseWithList<IGetFinishingInspectionRequest>> {
    let httpParams = new HttpParams();
    
    if (params.pageNumber !== undefined) {
      httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
    }
    if (params.lang) {
      httpParams = httpParams.set('lang', params.lang);
    }
    if (params.rowCount !== undefined) {
      httpParams = httpParams.set('rowCount', params.rowCount.toString());
    }
    if (params.requestStatus !== undefined) {
      httpParams = httpParams.set('requestStatus', params.requestStatus.toString());
    }
    if (params.From) {
      httpParams = httpParams.set('From', params.From);
    }
    if (params.To) {
      httpParams = httpParams.set('To', params.To);
    }
    if (params.textSearch) {
      httpParams = httpParams.set('textSearch', params.textSearch);
    }

    return this.http.get<IApiResponseWithList<IGetFinishingInspectionRequest>>(
      `${this.apiUrl}/get`,
      { params: httpParams }
    );
  }
}
