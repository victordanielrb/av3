import { Request, Response } from 'express';
import { EtapaService } from '../services/etapaService';

const etapaService = new EtapaService();

export class EtapaController {
  async create(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const { nome, prazo } = req.body;
      if (!nome || !prazo) {
        return res.status(400).json({ error: 'Nome e prazo sao obrigatorios' });
      }
      const id = await etapaService.create({ aeronaveCodigo: codigo as string, nome, prazo, status: 'PENDENTE' });
      return res.status(201).json({ id, message: 'Etapa adicionada com sucesso' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async findByAeronave(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const lista = await etapaService.findByAeronave(codigo as string);
      return res.json(lista);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async iniciar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await etapaService.iniciar(id);
      return res.json({ message: 'Etapa iniciada' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async finalizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await etapaService.finalizar(id);
      return res.json({ message: 'Etapa concluida' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async addFuncionario(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { funcionarioId } = req.body;
      if (!funcionarioId) {
        return res.status(400).json({ error: 'funcionarioId e obrigatorio' });
      }
      await etapaService.addFuncionario(id, Number(funcionarioId));
      return res.json({ message: 'Funcionario adicionado a etapa' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async listFuncionarios(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const lista = await etapaService.listFuncionarios(id);
      return res.json(lista);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async removeFuncionario(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const fid = Number(req.params.fid);
      await etapaService.removeFuncionario(id, fid);
      return res.json({ message: 'Funcionario removido da etapa' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await etapaService.delete(id);
      return res.json({ message: 'Etapa removida' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
