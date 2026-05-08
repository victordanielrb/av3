import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { FuncionarioRepository } from '../repositories/funcionarioRepository';

const funcionarioRepo = new FuncionarioRepository();

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token nao fornecido' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato de token invalido' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: number };
    const funcionario = await funcionarioRepo.findById(decoded.id);
    if (!funcionario) {
      return res.status(401).json({ error: 'Funcionario nao encontrado' });
    }
    req.user = funcionario;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalido' });
  }
}
