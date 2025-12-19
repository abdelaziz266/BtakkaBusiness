// DTO for creating account - matches Swagger API
export interface CreateAccountDto {
  currentRole: string;
  accountName: string;
  level: number;
  accountNumber: string;
  accountType: 'main' | 'sub';
  notes: string;
}
// Account model for list
export interface Account {
  id?: string;
  accountName: string;
  accountNumber: string;
  accountType: 'main' | 'sub';
  level: number;
  notes?: string;
  currentRole?: string;
}
