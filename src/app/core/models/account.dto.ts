export interface IGetAccount {
  id: number;
  accountCode: string;
  accountName: string;
  level: number;
  closingType: string;
  accountType: string;
  notes: string;
  parentCode: string | null;
  parentId: number | null;
  parentName: string | null;
}

export interface IAddAccount {
  accountCode: string;
  accountName: string;
  level: number;
  closingType: string;
  accountType: string;
  notes: string;
  parentId: number;
}