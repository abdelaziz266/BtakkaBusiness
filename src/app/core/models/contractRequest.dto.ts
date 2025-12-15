// Request Parameters DTO
export interface IGetContractRequestParams {
  lang: string;
  planId: string;
  fromDate?: string;
  toDate?: string;
  pageNumber: number;
  pageSize: number;
}

// Response Data DTO
export interface IGetContractRequest {
  name: string;
  mobile: string;
  requestDate: string;
  isRead: boolean;
  planName: string;
  planValue: number;
}
