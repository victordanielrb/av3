import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { testes, NovoTeste, Teste } from '../db/schema';

export class TesteRepository {
  async create(data: NovoTeste): Promise<number> {
    const result = await db.insert(testes).values(data);
    return result[0].insertId;
  }

  async findByAeronave(aeronaveCodigo: string): Promise<Teste[]> {
    return db.select().from(testes).where(eq(testes.aeronaveCodigo, aeronaveCodigo));
  }

  async delete(id: number): Promise<void> {
    await db.delete(testes).where(eq(testes.id, id));
  }
}
