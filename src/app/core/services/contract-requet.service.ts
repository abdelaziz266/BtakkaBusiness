import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IApiResponseWithList } from '../models/shared.dto';
import { IGetContractRequest, IGetContractRequestParams } from '../models/contractRequest.dto';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ContractRequetService {
  private apiUrl = `${environment.apiUrl}ContractRequet`;

  constructor(private http: HttpClient) { }

  getContractRequests(params: IGetContractRequestParams): Observable<IApiResponseWithList<IGetContractRequest[]>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('lang', params.lang);
    httpParams = httpParams.set('planId', params.planId.toString());
    httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
    httpParams = httpParams.set('pageSize', params.pageSize.toString());

    if (params.fromDate) {
      httpParams = httpParams.set('fromDate', params.fromDate);
    }
    if (params.toDate) {
      httpParams = httpParams.set('toDate', params.toDate);
    }

    return this.http.get<IApiResponseWithList<IGetContractRequest[]>>(
      `${this.apiUrl}/get`,
      { params: httpParams }
    );
  }
}
