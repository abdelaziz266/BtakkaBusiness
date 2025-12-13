export interface IGetCostCenter {
  id: number,
  code: string,
  name: string,
  level: number,
  accountType: number,
  notes: string,
  parentCode: string,
  parentName: string

}
export interface IAddCostCenter {
  code: string,
  name: string,
  level: number,
  costCenterType: string,
  notes: string,
  parentId: number
}