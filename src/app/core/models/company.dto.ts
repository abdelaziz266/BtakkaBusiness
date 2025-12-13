
export interface IGetCompanyDto {
  id: number;
  name: string;
  code: string;
  promoCode: string;
  logo: string;
  referralCompanyId: number;
  userName: string;
  phoneNumber: string;
  countryCode: string;
  address: string;
  unitsCount: number;
  engineersCount: number;
  categoryIds: string[];
  claimIds: number[];
  serviceCategoryIds: number[];
}