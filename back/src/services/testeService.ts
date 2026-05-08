import { TesteRepository } from '../repositories/testeRepository';
import { NovoTeste, Teste } from '../db/schema';

const testeRepo = new TesteRepository();

export class TesteService {
  async create(data: NovoTeste): Promise<number> {
    return testeRepo.create(data);
  }

  async findByAeronave(aeronaveCodigo: string): Promise<Teste[]> {
    return testeRepo.findByAeronave(aeronaveCodigo);
  }

  async delete(id: number): Promise<void> {
    await testeRepo.delete(id);
  }
}
