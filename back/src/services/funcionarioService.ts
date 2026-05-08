import bcrypt from 'bcryptjs';
import { FuncionarioRepository } from '../repositories/funcionarioRepository';
import { NovoFuncionario, Funcionario } from '../db/schema';

const funcionarioRepo = new FuncionarioRepository();

export class FuncionarioService {
  async create(data: NovoFuncionario & { senha: string }): Promise<number> {
    const existe = await funcionarioRepo.findByUsuario(data.usuario);
    if (existe) {
      throw new Error('Usuario ja existe');
    }
    const hash = await bcrypt.hash(data.senha, 10);
    return funcionarioRepo.create({ ...data, senha: hash });
  }

  async findAll(): Promise<Funcionario[]> {
    return funcionarioRepo.findAll();
  }

  async findById(id: number): Promise<Funcionario | undefined> {
    return funcionarioRepo.findById(id);
  }

  async delete(id: number): Promise<void> {
    await funcionarioRepo.delete(id);
  }
}
