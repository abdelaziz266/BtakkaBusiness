export interface IApiResponse<T> {
  status: number;
  message: string;
  data: T | null;
  errors: any | null;
  errorCode: string | null;
}

export interface IApiResponseWithList<T> {
  status: number;
  message: string;
  data: IListResponse<T>;
  errors: any | null;
  errorCode: string | null;
}
export interface IListResponse<T> {
  lastPage: boolean,
    data: T[],
    pagesCount: number
}
