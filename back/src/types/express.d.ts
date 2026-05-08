import { Request } from 'express';
import { Funcionario } from '../db/schema';

declare global {
  namespace Express {
    interface Request {
      user?: Funcionario;
    }
  }
}
