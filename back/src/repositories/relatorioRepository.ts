import { db } from '../db/connection';
import { relatorios, NovoRelatorio, Relatorio } from '../db/schema';

export class RelatorioRepository {
  async save(data: NovoRelatorio): Promise<number> {
    const result = await db.insert(relatorios).values(data);
    return result[0].insertId;
  }

  async findAll(): Promise<Relatorio[]> {
    return db.select().from(relatorios).orderBy(relatorios.id);
  }

}
