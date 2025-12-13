export interface IGetPlansDTO {
  id: number;
  title: string;
  value: number;
  description: string;
  order: number;
}

export interface IAddPlansDTO {
  title: string;
  value: number;
  description: string;
}