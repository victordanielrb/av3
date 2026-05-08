import { Request, Response, NextFunction } from 'express';

export function roleMiddleware(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Nao autenticado' });
    }
    if (!roles.includes(req.user.nivelPermissao)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
}
