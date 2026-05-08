import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { funcionarios, NovoFuncionario, Funcionario } from '../db/schema';

export class FuncionarioRepository {
  async create(data: NovoFuncionario): Promise<number> {
    const result = await db.insert(funcionarios).values(data);
    return result[0].insertId;
  }

  async findAll(): Promise<Funcionario[]> {
    return db.select().from(funcionarios);
  }

  async findById(id: number): Promise<Funcionario | undefined> {
    const rows = await db.select().from(funcionarios).where(eq(funcionarios.id, id));
    return rows[0];
  }

  async findByUsuario(usuario: string): Promise<Funcionario | undefined> {
    const rows = await db.select().from(funcionarios).where(eq(funcionarios.usuario, usuario));
    return rows[0];
  }

  async update(id: number, data: Partial<NovoFuncionario>): Promise<void> {
    await db.update(funcionarios).set(data).where(eq(funcionarios.id, id));
  }

  async delete(id: number): Promise<void> {
    await db.delete(funcionarios).where(eq(funcionarios.id, id));
  }
}
