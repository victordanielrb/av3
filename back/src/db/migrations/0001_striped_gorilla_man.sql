CREATE TABLE `relatorios` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`aeronave_codigo` varchar(50) NOT NULL,
	`cliente` varchar(255) NOT NULL,
	`data_entrega` varchar(50) NOT NULL,
	`dados` text NOT NULL,
	`gerado_em` varchar(50) NOT NULL,
	CONSTRAINT `relatorios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `etapa_funcionarios` MODIFY COLUMN `etapa_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `etapa_funcionarios` MODIFY COLUMN `funcionario_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `relatorios` ADD CONSTRAINT `relatorios_aeronave_codigo_aeronaves_codigo_fk` FOREIGN KEY (`aeronave_codigo`) REFERENCES `aeronaves`(`codigo`) ON DELETE cascade ON UPDATE no action;