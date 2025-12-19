export interface IGetCostCenter {
  id: number;
  code: string;
  name: string;
  level: number;
  accountType: string;
  notes: string;
  parentCode: string;
  parentName: string;
  parentId?: number;
}

export interface IAddCostCenter {
  code: string;
  name: string;
  level: number;
  accountType: string;
  notes: string;
  parentId: number | null;
}
