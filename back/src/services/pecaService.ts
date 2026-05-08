import { PecaRepository } from '../repositories/pecaRepository';
import { NovaPeca, Peca } from '../db/schema';

const pecaRepo = new PecaRepository();

export class PecaService {
  async create(data: NovaPeca): Promise<number> {
    return pecaRepo.create(data);
  }

  async findByAeronave(aeronaveCodigo: string): Promise<Peca[]> {
    return pecaRepo.findByAeronave(aeronaveCodigo);
  }

  async updateStatus(id: number, status: string): Promise<void> {
    const peca = await pecaRepo.findById(id);
    if (!peca) {
      throw new Error('Peca nao encontrada');
    }
    await pecaRepo.updateStatus(id, status);
  }

  async delete(id: number): Promise<void> {
    await pecaRepo.delete(id);
  }
}
