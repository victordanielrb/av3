import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { etapas, NovaEtapa, Etapa } from '../db/schema';

export class EtapaRepository {
  async create(data: NovaEtapa): Promise<number> {
    const result = await db.insert(etapas).values(data);
    return result[0].insertId;
  }

  async findByAeronave(aeronaveCodigo: string): Promise<Etapa[]> {
    return db.select().from(etapas).where(eq(etapas.aeronaveCodigo, aeronaveCodigo));
  }

  async findById(id: number): Promise<Etapa | undefined> {
    const rows = await db.select().from(etapas).where(eq(etapas.id, id));
    return rows[0];
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await db.update(etapas).set({ status: status as any }).where(eq(etapas.id, id));
  }

  async delete(id: number): Promise<void> {
    await db.delete(etapas).where(eq(etapas.id, id));
  }
}
