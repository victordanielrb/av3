import { Request, Response } from 'express';
import { RelatorioService } from '../services/relatorioService';

const relatorioService = new RelatorioService();

export class RelatorioController {
  async gerar(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const { cliente, dataEntrega } = req.query as { cliente: string; dataEntrega: string };
      if (!cliente || !dataEntrega) {
        return res.status(400).json({ error: 'cliente e dataEntrega sao obrigatorios' });
      }
      const relatorio = await relatorioService.gerarRelatorio(codigo as string, cliente as string, dataEntrega as string);
      return res.json(relatorio);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async salvar(req: Request, res: Response) {
    try {
      const { aeronaveCodigo, cliente, dataEntrega, dados, geradoEm } = req.body;
      if (!aeronaveCodigo || !cliente || !dataEntrega || !dados || !geradoEm) {
        return res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      }
      const id = await relatorioService.salvar(aeronaveCodigo, cliente, dataEntrega, dados, geradoEm);
      return res.status(201).json({ id, message: 'Relatorio salvo com sucesso' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const lista = await relatorioService.listar();
      return res.json(lista);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
