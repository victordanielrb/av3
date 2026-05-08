# AeroCode — AV2

---

## Requisitos e Público-alvo

O sistema foi concebido para apoiar o acompanhamento do ciclo de produção e manutenção de aeronaves, centralizando informações operacionais em um único painel. A partir das telas e fluxos implementados, as principais necessidades atendidas são:

- Controle de acesso por perfil (Administrador, Engenheiro e Operador), com permissões específicas para cada ação.
- Gestão de aeronaves com cadastro, edição, remoção e consulta de dados técnicos e status.
- Gestão de peças com acompanhamento de vínculo por aeronave, tipo e situação operacional.
- Gestão de etapas do processo com atualização de status e validação de sequência de execução.
- Gestão de funcionários para organização de equipe e associação de responsabilidades.
- Registro de testes técnicos e seus resultados para rastreabilidade de conformidade.
- Emissão e consulta de relatórios para suporte à análise e tomada de decisão.
- Área de perfil de usuário para manutenção de credenciais básicas.

Público-alvo:

- Engenheiros de Produção.
- Engenheiros Aeronáuticos.
- Operadores técnicos .

---

## Fluxo de Usuário

```mermaid
flowchart TD
    LOGIN([Login]) --> AUTH{Autenticação}
    AUTH -- Falha --> LOGIN

    AUTH --> AERONAVES[Aeronaves]
    AUTH --> PECAS[Peças]
    AUTH --> ETAPAS[Etapas]
    AUTH --> FUNCIONARIOS[Funcionários]
    AUTH --> TESTES[Testes]
    AUTH --> RELATORIO[Relatório]

    AERONAVES & PECAS & ETAPAS & FUNCIONARIOS & TESTES & RELATORIO --> LOGOUT([Logout])
    LOGOUT --> LOGIN
```

---

## Telas







### Login

![Login](./docs/AV2%20-%20Prototipo/Login.png)

---

### Menu Principal

![Menu Principal](./docs/AV2%20-%20Prototipo/Aeronaves.png)

---

### Menu — Aeronaves

![Aeronaves](./docs/AV2%20-%20Prototipo/Aeronaves.png)

---

### Menu — Peças

![Peças](./docs/AV2%20-%20Prototipo/Pe%C3%A7as.png)

---

### Menu — Etapas

![Etapas](./docs/AV2%20-%20Prototipo/Etapas.png)

> Regra: etapa só pode ser iniciada se a anterior estiver `CONCLUÍDA`.

---

### Menu — Funcionários

![Funcionários](./docs/AV2%20-%20Prototipo/Funcionario.png)

---

### Menu — Testes

![Testes](./docs/AV2%20-%20Prototipo/ModalExample.png)

---

### Modal de Ação

![Modal](./docs/AV2%20-%20Prototipo/ModalExample.png)

---

### Perfil do Usuário

![Perfil](./docs/AV2%20-%20Prototipo/User.png)

---

### Notificações

![Notificações](./docs/AV2%20-%20Prototipo/Notification.png)
