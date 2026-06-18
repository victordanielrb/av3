# AeroCode — Sistema de Gestão de Aeronaves

Um sistema web completo para gerenciamento de produção, manutenção e controle de aeronaves, funcionários, peças, etapas de produção e testes técnicos.

## 📋 O que é o Projeto

O **AeroCode** (av3) é uma aplicação desenvolvida para centralizar e apoiar o acompanhamento do ciclo de produção e manutenção de aeronaves. O sistema oferece:

- **Controle de Acesso**: Gestão por perfil (Administrador, Engenheiro, Operador)
- **Gestão de Aeronaves**: Cadastro, edição, consulta de dados técnicos e status
- **Gestão de Peças**: Acompanhamento de vínculos, tipos e situação operacional
- **Gestão de Etapas**: Atualização de status e validação de sequência
- **Gestão de Funcionários**: Organização de equipe e responsabilidades
- **Registro de Testes**: Rastreabilidade de testes técnicos e conformidade
- **Relatórios**: Emissão e consulta para análise e tomada de decisão
- **Perfil de Usuário**: Manutenção de credenciais

## 🚀 Como Rodar

### Pré-requisitos

- Docker e Docker Compose (recomendado)
- OU Node.js 20.x + npm 10+

### Opção 1: Com Docker Compose (Recomendado)

```bash
docker compose up --build
```

Isso irá:
- Subir o banco MySQL na porta **3307** e rodar as migrations automaticamente
- Compilar e rodar o backend na porta **3000**
- Compilar e rodar o frontend na porta **5173**

Acesse a aplicação em: **http://localhost:5173**

### Opção 2: Manualmente (Sem Docker)

Requer um servidor **MySQL 8** rodando localmente. Configure a variável `DATABASE_URL` em `back/.env` (veja `back/.env.example`).

#### Backend

```bash
cd back
npm install
npm run dev
```

O backend rodará em `http://localhost:3000` e aplicará as migrations automaticamente na inicialização.

#### Frontend (em outro terminal)

```bash
cd front
npm install
npm run dev
```

O frontend rodará em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
.
├── back/                    # API Backend (Node.js + TypeScript)
│   ├── src/
│   │   ├── controllers/     # Controladores de requisições
│   │   ├── services/        # Lógica de negócio
│   │   ├── repositories/    # Acesso a dados
│   │   ├── routes/          # Definição de rotas
│   │   ├── db/              # Configuração e migrations do banco
│   │   ├── middlewares/     # Middlewares (autenticação, autorização)
│   │   └── config/          # Configurações
│   └── Dockerfile
│
├── front/                   # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── services/        # APIs e integração
│   │   ├── context/         # Context API
│   │   └── data/            # Mock data
│   └── Dockerfile
│
└── docker-compose.yml       # Orquestração de containers
```

## 🛠️ Tecnologias

### Backend
- Node.js + TypeScript
- Express.js
- Drizzle ORM
- MySQL 8

### Frontend
- React
- Vite
- JavaScript/JSX

## 🔐 Autenticação

O sistema implementa controle de acesso por perfis:
- **Administrador**: Acesso completo
- **Engenheiro**: Acesso à maioria das funcionalidades
- **Operador**: Acesso limitado

## � Documentação Adicional

- Backend: Consulte [back/README.md](back/README.md)
- Frontend: Consulte [front/README.md](front/README.md)
