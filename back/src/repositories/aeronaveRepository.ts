import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { aeronaves, NovoAeronave, Aeronave } from '../db/schema';

export class AeronaveRepository {
  async create(data: NovoAeronave): Promise<void> {
    await db.insert(aeronaves).values(data);
  }

  async findAll(): Promise<Aeronave[]> {
    return db.select().from(aeronaves);
  }

  async findByCodigo(codigo: string): Promise<Aeronave | undefined> {
    const rows = await db.select().from(aeronaves).where(eq(aeronaves.codigo, codigo));
    return rows[0];
  }

  async update(codigo: string, data: Partial<NovoAeronave>): Promise<void> {
    await db.update(aeronaves).set(data).where(eq(aeronaves.codigo, codigo));
  }

  async delete(codigo: string): Promise<void> {
    await db.delete(aeronaves).where(eq(aeronaves.codigo, codigo));
  }
}
