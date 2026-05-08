import { Request, Response } from 'express';
import { FuncionarioService } from '../services/funcionarioService';
import { NivelPermissao } from '../tipo/enums';

const funcionarioService = new FuncionarioService();

export class FuncionarioController {
  async create(req: Request, res: Response) {
    try {
      const { nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body;
      if (!nome || !telefone || !endereco || !usuario || !senha || !nivelPermissao) {
        return res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      }
      if (!Object.values(NivelPermissao).includes(nivelPermissao)) {
        return res.status(400).json({ error: `Nivel invalido. Use: ${Object.values(NivelPermissao).join(', ')}` });
      }
      const id = await funcionarioService.create({ nome, telefone, endereco, usuario, senha, nivelPermissao });
      return res.status(201).json({ id, message: 'Funcionario cadastrado com sucesso' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const id = req.user!.id;
      const funcionario = await funcionarioService.findById(id);
      if (!funcionario) return res.status(404).json({ error: 'Funcionario nao encontrado' });
      const { senha: _, ...dados } = funcionario as any;
      return res.json(dados);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const lista = await funcionarioService.findAll();
      return res.json(lista);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (req.user && req.user.id === id) {
        return res.status(400).json({ error: 'Voce nao pode remover a si mesmo' });
      }
      await funcionarioService.delete(id);
      return res.json({ message: 'Funcionario removido' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
