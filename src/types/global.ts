export interface CurrUser {
  user_id: number;
  tenant_id: number;
  role: Role;
}

export enum Role {
  ADMIN = "ADMIN",
  TECHNICIAN = "TECHNICIAN",
  CUSTOMER = "CUSTOMER",
}
