import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { FuncionarioRepository } from '../repositories/funcionarioRepository';
import { Funcionario } from '../db/schema';

const funcionarioRepo = new FuncionarioRepository();

export class AuthService {
  async registrar(funcionario: Omit<Funcionario, 'id'> & { senha: string }): Promise<number> {
    const existe = await funcionarioRepo.findByUsuario(funcionario.usuario);
    if (existe) {
      throw new Error('Usuario ja existe');
    }
    const hash = await bcrypt.hash(funcionario.senha, 10);
    return funcionarioRepo.create({ ...funcionario, senha: hash });
  }

  async login(usuario: string, senha: string): Promise<string> {
    const funcionario = await funcionarioRepo.findByUsuario(usuario);
    if (!funcionario) {
      throw new Error('Credenciais invalidas');
    }
    const valido = await bcrypt.compare(senha, funcionario.senha);
    if (!valido) {
      throw new Error('Credenciais invalidas');
    }
    const token = jwt.sign(
      { id: funcionario.id, usuario: funcionario.usuario, nivelPermissao: funcionario.nivelPermissao },
      env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    return token;
  }

  async verificarToken(token: string): Promise<{ id: number; usuario: string; nivelPermissao: string }> {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    return decoded;
  }
}
