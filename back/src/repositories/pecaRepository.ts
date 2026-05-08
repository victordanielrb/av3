import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { pecas, NovaPeca, Peca } from '../db/schema';

export class PecaRepository {
  async create(data: NovaPeca): Promise<number> {
    const result = await db.insert(pecas).values(data);
    return result[0].insertId;
  }

  async findByAeronave(aeronaveCodigo: string): Promise<Peca[]> {
    return db.select().from(pecas).where(eq(pecas.aeronaveCodigo, aeronaveCodigo));
  }

  async findById(id: number): Promise<Peca | undefined> {
    const rows = await db.select().from(pecas).where(eq(pecas.id, id));
    return rows[0];
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await db.update(pecas).set({ status: status as any }).where(eq(pecas.id, id));
  }

  async delete(id: number): Promise<void> {
    await db.delete(pecas).where(eq(pecas.id, id));
  }
}
