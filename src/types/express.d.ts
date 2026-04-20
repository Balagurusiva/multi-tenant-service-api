import { Request } from 'express';

export interface jwtPayload {
  user_id: number,
  tenant_id: number,
  role: 'ADMIN' | 'TECHNICIAN' | "CUSTOMER"
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}