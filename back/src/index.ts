import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import routes from './routes';
import { FuncionarioRepository } from './repositories/funcionarioRepository';
import { NivelPermissao } from './tipo/enums';
import bcrypt from 'bcryptjs';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db } from './db/connection';
import path from 'path';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

async function seedAdmin() {
  const repo = new FuncionarioRepository();
  const funcionarios = await repo.findAll();
  if (funcionarios.length === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await repo.create({
      nome: 'Administrador',
      telefone: '(00) 00000-0000',
      endereco: 'Sede Aerocode',
      usuario: 'admin',
      senha: hash,
      nivelPermissao: NivelPermissao.ADMINISTRADOR,
    });
    console.log('Seed: Usuario admin criado (usuario: admin, senha: admin123)');
  }
}

async function main() {
  await migrate(db, { migrationsFolder: path.join(__dirname, 'db/migrations') });
  await seedAdmin();
  app.listen(env.PORT, () => {
    console.log(`Aerocode API rodando na porta ${env.PORT}`);
  });
}

main();
