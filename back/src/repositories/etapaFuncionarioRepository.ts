import { and, eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { etapaFuncionarios, NovaEtapaFuncionario, EtapaFuncionario, funcionarios } from '../db/schema';

export class EtapaFuncionarioRepository {
  async addFuncionario(data: NovaEtapaFuncionario): Promise<number> {
    const result = await db.insert(etapaFuncionarios).values(data);
    return result[0].insertId;
  }

  async findByEtapa(etapaId: number): Promise<{ funcionarioId: number; nome: string; telefone: string; nivelPermissao: string }[]> {
    return db
      .select({
        funcionarioId: funcionarios.id,
        nome: funcionarios.nome,
        telefone: funcionarios.telefone,
        nivelPermissao: funcionarios.nivelPermissao,
      })
      .from(etapaFuncionarios)
      .innerJoin(funcionarios, eq(etapaFuncionarios.funcionarioId, funcionarios.id))
      .where(eq(etapaFuncionarios.etapaId, etapaId));
  }

  async removeFuncionario(etapaId: number, funcionarioId: number): Promise<void> {
    await db
      .delete(etapaFuncionarios)
      .where(and(eq(etapaFuncionarios.etapaId, etapaId), eq(etapaFuncionarios.funcionarioId, funcionarioId)));
  }

  async exists(etapaId: number, funcionarioId: number): Promise<boolean> {
    const rows = await db
      .select()
      .from(etapaFuncionarios)
      .where(and(eq(etapaFuncionarios.etapaId, etapaId), eq(etapaFuncionarios.funcionarioId, funcionarioId)));
    return rows.length > 0;
  }
}
