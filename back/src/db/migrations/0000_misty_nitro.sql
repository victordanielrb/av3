CREATE TABLE IF NOT EXISTS `aeronaves` (
	`codigo` varchar(50) NOT NULL,
	`modelo` varchar(255) NOT NULL,
	`tipo_aeronave` enum('COMERCIAL','MILITAR') NOT NULL,
	`capacidade` int NOT NULL,
	`alcance` int NOT NULL,
	CONSTRAINT `aeronaves_codigo` PRIMARY KEY(`codigo`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `funcionarios` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`telefone` varchar(50) NOT NULL,
	`endereco` text NOT NULL,
	`usuario` varchar(100) NOT NULL,
	`senha` varchar(255) NOT NULL,
	`nivel_permissao` enum('ADMINISTRADOR','ENGENHEIRO','OPERADOR') NOT NULL,
	CONSTRAINT `funcionarios_id` PRIMARY KEY(`id`),
	CONSTRAINT `funcionarios_usuario_unique` UNIQUE(`usuario`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `etapas` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`aeronave_codigo` varchar(50) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`prazo` varchar(50) NOT NULL,
	`status_etapa` enum('PENDENTE','ANDAMENTO','CONCLUIDA') NOT NULL DEFAULT 'PENDENTE',
	CONSTRAINT `etapas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `etapa_funcionarios` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`etapa_id` bigint unsigned NOT NULL,
	`funcionario_id` bigint unsigned NOT NULL,
	CONSTRAINT `etapa_funcionarios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `pecas` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`aeronave_codigo` varchar(50) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`tipo_peca` enum('NACIONAL','IMPORTADA') NOT NULL,
	`fornecedor` varchar(255) NOT NULL,
	`status_peca` enum('EM_PRODUCAO','EM_TRANSPORTE','PRONTA') NOT NULL,
	CONSTRAINT `pecas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `testes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`aeronave_codigo` varchar(50) NOT NULL,
	`tipo_teste` enum('ELETRICO','HIDRAULICO','AERODINAMICO') NOT NULL,
	`resultado_teste` enum('APROVADO','REPROVADO') NOT NULL,
	CONSTRAINT `testes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `etapa_funcionarios` ADD CONSTRAINT `etapa_funcionarios_etapa_id_etapas_id_fk` FOREIGN KEY (`etapa_id`) REFERENCES `etapas`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `etapa_funcionarios` ADD CONSTRAINT `etapa_funcionarios_funcionario_id_funcionarios_id_fk` FOREIGN KEY (`funcionario_id`) REFERENCES `funcionarios`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `etapas` ADD CONSTRAINT `etapas_aeronave_codigo_aeronaves_codigo_fk` FOREIGN KEY (`aeronave_codigo`) REFERENCES `aeronaves`(`codigo`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pecas` ADD CONSTRAINT `pecas_aeronave_codigo_aeronaves_codigo_fk` FOREIGN KEY (`aeronave_codigo`) REFERENCES `aeronaves`(`codigo`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `testes` ADD CONSTRAINT `testes_aeronave_codigo_aeronaves_codigo_fk` FOREIGN KEY (`aeronave_codigo`) REFERENCES `aeronaves`(`codigo`) ON DELETE cascade ON UPDATE no action;
