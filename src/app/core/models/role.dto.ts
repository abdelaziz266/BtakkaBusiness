
export interface IClaimDto {
  id: number;
  arName: string;
}

export interface ICompanyRoleClaimDto {
  id: string;
  title: string;
  arTitle: string;
  claims: IClaimDto[];
}