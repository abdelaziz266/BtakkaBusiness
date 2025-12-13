import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {ICompanyRoleClaimDto } from '../models/role.dto';
import { IApiResponse } from '../models/shared.dto';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = environment.apiUrl + 'Role/';

  constructor(private http: HttpClient) {}

  getCompanyRoleClaims(): Observable<IApiResponse<ICompanyRoleClaimDto[]>> {
    return this.http.get<IApiResponse<ICompanyRoleClaimDto[]>>(
      `${this.apiUrl}company-role-claims`
    );
  }
}
