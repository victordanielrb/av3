import { EtapaRepository } from '../repositories/etapaRepository';
import { EtapaFuncionarioRepository } from '../repositories/etapaFuncionarioRepository';
import { FuncionarioRepository } from '../repositories/funcionarioRepository';
import { NovaEtapa, Etapa } from '../db/schema';
import { StatusEtapa } from '../tipo/enums';

const etapaRepo = new EtapaRepository();
const etapaFuncRepo = new EtapaFuncionarioRepository();
const funcionarioRepo = new FuncionarioRepository();

export class EtapaService {
  async create(data: NovaEtapa): Promise<number> {
    return etapaRepo.create(data);
  }

  async findByAeronave(aeronaveCodigo: string): Promise<Etapa[]> {
    return etapaRepo.findByAeronave(aeronaveCodigo);
  }

  async iniciar(id: number): Promise<void> {
    const etapa = await etapaRepo.findById(id);
    if (!etapa) throw new Error('Etapa nao encontrada');
    if (etapa.status !== StatusEtapa.PENDENTE) {
      throw new Error(`Etapa nao esta pendente (status: ${etapa.status})`);
    }

    const funcionarios = await etapaFuncRepo.findByEtapa(id);
    if (funcionarios.length === 0) {
      throw new Error('A etapa precisa ter ao menos um funcionario antes de ser iniciada');
    }

    const todasEtapas = await etapaRepo.findByAeronave(etapa.aeronaveCodigo);
    const ordenadas = todasEtapas.sort((a, b) => a.id - b.id);
    const idx = ordenadas.findIndex((e) => e.id === id);
    if (idx > 0) {
      const anterior = ordenadas[idx - 1];
      if (anterior.status !== StatusEtapa.CONCLUIDA) {
        throw new Error(`A etapa anterior "${anterior.nome}" precisa ser concluida primeiro`);
      }
    }

    await etapaRepo.updateStatus(id, StatusEtapa.ANDAMENTO);
  }

  async finalizar(id: number): Promise<void> {
    const etapa = await etapaRepo.findById(id);
    if (!etapa) throw new Error('Etapa nao encontrada');
    if (etapa.status !== StatusEtapa.ANDAMENTO) {
      throw new Error(`Etapa nao esta em andamento (status: ${etapa.status})`);
    }
    await etapaRepo.updateStatus(id, StatusEtapa.CONCLUIDA);
  }

  async addFuncionario(etapaId: number, funcionarioId: number): Promise<void> {
    const etapa = await etapaRepo.findById(etapaId);
    if (!etapa) throw new Error('Etapa nao encontrada');
    const funcionario = await funcionarioRepo.findById(funcionarioId);
    if (!funcionario) throw new Error('Funcionario nao encontrado');

    const jaExiste = await etapaFuncRepo.exists(etapaId, funcionarioId);
    if (jaExiste) {
      throw new Error('Funcionario ja esta nesta etapa');
    }

    await etapaFuncRepo.addFuncionario({ etapaId, funcionarioId });
  }

  async listFuncionarios(etapaId: number) {
    return etapaFuncRepo.findByEtapa(etapaId);
  }

  async removeFuncionario(etapaId: number, funcionarioId: number): Promise<void> {
    const etapa = await etapaRepo.findById(etapaId);
    if (!etapa) throw new Error('Etapa nao encontrada');
    await etapaFuncRepo.removeFuncionario(etapaId, funcionarioId);
  }

  async delete(id: number): Promise<void> {
    await etapaRepo.delete(id);
  }
}
