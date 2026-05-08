import { mysqlTable, serial, varchar, int, bigint, text, mysqlEnum } from 'drizzle-orm/mysql-core';

export const tipoAeronaveEnum = mysqlEnum('tipo_aeronave', ['COMERCIAL', 'MILITAR']);
export const tipoPecaEnum = mysqlEnum('tipo_peca', ['NACIONAL', 'IMPORTADA']);
export const statusPecaEnum = mysqlEnum('status_peca', ['EM_PRODUCAO', 'EM_TRANSPORTE', 'PRONTA']);
export const statusEtapaEnum = mysqlEnum('status_etapa', ['PENDENTE', 'ANDAMENTO', 'CONCLUIDA']);
export const nivelPermissaoEnum = mysqlEnum('nivel_permissao', ['ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR']);
export const tipoTesteEnum = mysqlEnum('tipo_teste', ['ELETRICO', 'HIDRAULICO', 'AERODINAMICO']);
export const resultadoTesteEnum = mysqlEnum('resultado_teste', ['APROVADO', 'REPROVADO']);

export const aeronaves = mysqlTable('aeronaves', {
  codigo: varchar('codigo', { length: 50 }).primaryKey(),
  modelo: varchar('modelo', { length: 255 }).notNull(),
  tipo: tipoAeronaveEnum.notNull(),
  capacidade: int('capacidade').notNull(),
  alcance: int('alcance').notNull(),
});

export const funcionarios = mysqlTable('funcionarios', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  telefone: varchar('telefone', { length: 50 }).notNull(),
  endereco: text('endereco').notNull(),
  usuario: varchar('usuario', { length: 100 }).notNull().unique(),
  senha: varchar('senha', { length: 255 }).notNull(),
  nivelPermissao: nivelPermissaoEnum.notNull(),
});

export const pecas = mysqlTable('pecas', {
  id: serial('id').primaryKey(),
  aeronaveCodigo: varchar('aeronave_codigo', { length: 50 }).notNull().references(() => aeronaves.codigo, { onDelete: 'cascade' }),
  nome: varchar('nome', { length: 255 }).notNull(),
  tipo: tipoPecaEnum.notNull(),
  fornecedor: varchar('fornecedor', { length: 255 }).notNull(),
  status: statusPecaEnum.notNull(),
});

export const etapas = mysqlTable('etapas', {
  id: serial('id').primaryKey(),
  aeronaveCodigo: varchar('aeronave_codigo', { length: 50 }).notNull().references(() => aeronaves.codigo, { onDelete: 'cascade' }),
  nome: varchar('nome', { length: 255 }).notNull(),
  prazo: varchar('prazo', { length: 50 }).notNull(),
  status: statusEtapaEnum.notNull().default('PENDENTE'),
});

export const testes = mysqlTable('testes', {
  id: serial('id').primaryKey(),
  aeronaveCodigo: varchar('aeronave_codigo', { length: 50 }).notNull().references(() => aeronaves.codigo, { onDelete: 'cascade' }),
  tipo: tipoTesteEnum.notNull(),
  resultado: resultadoTesteEnum.notNull(),
});

export const etapaFuncionarios = mysqlTable('etapa_funcionarios', {
  id: serial('id').primaryKey(),
  etapaId: bigint('etapa_id', { mode: 'number', unsigned: true }).notNull().references(() => etapas.id, { onDelete: 'cascade' }),
  funcionarioId: bigint('funcionario_id', { mode: 'number', unsigned: true }).notNull().references(() => funcionarios.id, { onDelete: 'cascade' }),
});

export type Aeronave = typeof aeronaves.$inferSelect;
export type NovoAeronave = typeof aeronaves.$inferInsert;

export type Funcionario = typeof funcionarios.$inferSelect;
export type NovoFuncionario = typeof funcionarios.$inferInsert;

export type Peca = typeof pecas.$inferSelect;
export type NovaPeca = typeof pecas.$inferInsert;

export type Etapa = typeof etapas.$inferSelect;
export type NovaEtapa = typeof etapas.$inferInsert;

export type Teste = typeof testes.$inferSelect;
export type NovoTeste = typeof testes.$inferInsert;

export type EtapaFuncionario = typeof etapaFuncionarios.$inferSelect;
export type NovaEtapaFuncionario = typeof etapaFuncionarios.$inferInsert;

export const relatorios = mysqlTable('relatorios', {
  id: serial('id').primaryKey(),
  aeronaveCodigo: varchar('aeronave_codigo', { length: 50 }).notNull().references(() => aeronaves.codigo, { onDelete: 'cascade' }),
  cliente: varchar('cliente', { length: 255 }).notNull(),
  dataEntrega: varchar('data_entrega', { length: 50 }).notNull(),
  dados: text('dados').notNull(),
  geradoEm: varchar('gerado_em', { length: 50 }).notNull(),
});

export type Relatorio = typeof relatorios.$inferSelect;
export type NovoRelatorio = typeof relatorios.$inferInsert;
