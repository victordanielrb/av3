import { Request, Response } from 'express';
import { TesteService } from '../services/testeService';

const testeService = new TesteService();

export class TesteController {
  async create(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const { tipo, resultado } = req.body;
      if (!tipo || !resultado) {
        return res.status(400).json({ error: 'Tipo e resultado sao obrigatorios' });
      }
      const id = await testeService.create({ aeronaveCodigo: codigo as string, tipo, resultado });
      return res.status(201).json({ id, message: 'Teste registrado com sucesso' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async findByAeronave(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const lista = await testeService.findByAeronave(codigo as string);
      return res.json(lista);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await testeService.delete(id);
      return res.json({ message: 'Teste removido' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
