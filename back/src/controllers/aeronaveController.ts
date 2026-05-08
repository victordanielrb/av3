import { Request, Response } from 'express';
import { AeronaveService } from '../services/aeronaveService';
import { TipoAeronave } from '../tipo/enums';

const aeronaveService = new AeronaveService();

export class AeronaveController {
  async create(req: Request, res: Response) {
    try {
      const { codigo, modelo, tipo, capacidade, alcance } = req.body;
      if (!codigo || !modelo || !tipo || capacidade === undefined || alcance === undefined) {
        return res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      }
      if (!Object.values(TipoAeronave).includes(tipo)) {
        return res.status(400).json({ error: `Tipo invalido. Use: ${Object.values(TipoAeronave).join(', ')}` });
      }
      await aeronaveService.create({ codigo, modelo, tipo, capacidade: Number(capacidade), alcance: Number(alcance) });
      return res.status(201).json({ message: 'Aeronave cadastrada com sucesso' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const lista = await aeronaveService.findAll();
      return res.json(lista);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async findByCodigo(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const dados = await aeronaveService.findByCodigo(codigo as string);
      if (!dados) {
        return res.status(404).json({ error: 'Aeronave nao encontrada' });
      }
      return res.json(dados);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      if (req.body.tipo && !Object.values(TipoAeronave).includes(req.body.tipo)) {
        return res.status(400).json({ error: `Tipo invalido. Use: ${Object.values(TipoAeronave).join(', ')}` });
      }
      await aeronaveService.update(codigo as string, req.body);
      return res.json({ message: 'Aeronave atualizada' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      await aeronaveService.delete(codigo as string);
      return res.json({ message: 'Aeronave removida' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
