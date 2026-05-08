import { Request, Response } from 'express';
import { PecaService } from '../services/pecaService';
import { TipoPeca, StatusPeca } from '../tipo/enums';

const pecaService = new PecaService();

export class PecaController {
  async create(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const { nome, tipo, fornecedor, status } = req.body;
      if (!nome || !tipo || !fornecedor || !status) {
        return res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      }
      if (!Object.values(TipoPeca).includes(tipo)) {
        return res.status(400).json({ error: `Tipo invalido. Use: ${Object.values(TipoPeca).join(', ')}` });
      }
      if (!Object.values(StatusPeca).includes(status)) {
        return res.status(400).json({ error: `Status invalido. Use: ${Object.values(StatusPeca).join(', ')}` });
      }
      const id = await pecaService.create({ aeronaveCodigo: codigo as string, nome, tipo, fornecedor, status });
      return res.status(201).json({ id, message: 'Peca adicionada com sucesso' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async findByAeronave(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const lista = await pecaService.findByAeronave(codigo as string);
      return res.json(lista);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Status e obrigatorio' });
      }
      if (!Object.values(StatusPeca).includes(status)) {
        return res.status(400).json({ error: `Status invalido. Use: ${Object.values(StatusPeca).join(', ')}` });
      }
      await pecaService.updateStatus(id, status);
      return res.json({ message: 'Status atualizado' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await pecaService.delete(id);
      return res.json({ message: 'Peca removida' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
