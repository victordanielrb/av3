import { AeronaveService } from './aeronaveService';
import { EtapaFuncionarioRepository } from '../repositories/etapaFuncionarioRepository';
import { RelatorioRepository } from '../repositories/relatorioRepository';

const aeronaveService = new AeronaveService();
const etapaFuncRepo = new EtapaFuncionarioRepository();
const relatorioRepo = new RelatorioRepository();

export class RelatorioService {
  async gerarRelatorio(codigoAeronave: string, cliente: string, dataEntrega: string) {
    const dados = await aeronaveService.findByCodigo(codigoAeronave);
    if (!dados) throw new Error('Aeronave nao encontrada');

    const { aeronave, pecas, etapas, testes } = dados;

    const etapasComFuncionarios = await Promise.all(
      etapas.map(async (e) => {
        const funcionarios = await etapaFuncRepo.findByEtapa(e.id);
        return { ...e, funcionarios };
      })
    );

    return {
      geradoEm: new Date().toISOString(),
      aeronave: {
        codigo: aeronave.codigo,
        modelo: aeronave.modelo,
        tipo: aeronave.tipo,
        capacidade: aeronave.capacidade,
        alcance: aeronave.alcance,
      },
      entrega: { cliente, dataEntrega },
      pecas: pecas.map((p) => ({
        nome: p.nome,
        tipo: p.tipo,
        fornecedor: p.fornecedor,
        status: p.status,
      })),
      etapas: etapasComFuncionarios.map((e) => ({
        nome: e.nome,
        prazo: e.prazo,
        status: e.status,
        funcionarios: e.funcionarios.map((f) => ({ nome: f.nome, nivelPermissao: f.nivelPermissao })),
      })),
      testes: testes.map((t) => ({ tipo: t.tipo, resultado: t.resultado })),
    };
  }

  async salvar(aeronaveCodigo: string, cliente: string, dataEntrega: string, dados: string, geradoEm: string): Promise<number> {
    return relatorioRepo.save({ aeronaveCodigo, cliente, dataEntrega, dados, geradoEm });
  }

  async listar() {
    const rows = await relatorioRepo.findAll();
    return rows.map(r => ({
      id: r.id,
      aeronaveCodigo: r.aeronaveCodigo,
      cliente: r.cliente,
      dataEntrega: r.dataEntrega,
      geradoEm: r.geradoEm,
      dados: JSON.parse(r.dados),
    }));
  }
}
