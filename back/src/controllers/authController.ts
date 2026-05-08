import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { usuario, senha } = req.body;
      if (!usuario || !senha) {
        return res.status(400).json({ error: 'Usuario e senha sao obrigatorios' });
      }
      const token = await authService.login(usuario, senha);
      return res.json({ token });
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }
}
