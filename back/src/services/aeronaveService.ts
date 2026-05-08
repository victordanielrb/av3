import { AeronaveRepository } from '../repositories/aeronaveRepository';
import { PecaRepository } from '../repositories/pecaRepository';
import { EtapaRepository } from '../repositories/etapaRepository';
import { TesteRepository } from '../repositories/testeRepository';
import { NovoAeronave, Aeronave } from '../db/schema';

const aeronaveRepo = new AeronaveRepository();
const pecaRepo = new PecaRepository();
const etapaRepo = new EtapaRepository();
const testeRepo = new TesteRepository();

export class AeronaveService {
  async create(data: NovoAeronave): Promise<void> {
    const existe = await aeronaveRepo.findByCodigo(data.codigo);
    if (existe) {
      throw new Error('Codigo de aeronave ja existe');
    }
    await aeronaveRepo.create(data);
  }

  async findAll(): Promise<Aeronave[]> {
    return aeronaveRepo.findAll();
  }

  async findByCodigo(codigo: string): Promise<{ aeronave: Aeronave; pecas: any[]; etapas: any[]; testes: any[] } | null> {
    const aeronave = await aeronaveRepo.findByCodigo(codigo);
    if (!aeronave) return null;
    const [pecas, etapas, testes] = await Promise.all([
      pecaRepo.findByAeronave(codigo),
      etapaRepo.findByAeronave(codigo),
      testeRepo.findByAeronave(codigo),
    ]);
    return { aeronave, pecas, etapas, testes };
  }

  async update(codigo: string, data: Partial<NovoAeronave>): Promise<void> {
    await aeronaveRepo.update(codigo, data);
  }

  async delete(codigo: string): Promise<void> {
    await aeronaveRepo.delete(codigo);
  }
}
