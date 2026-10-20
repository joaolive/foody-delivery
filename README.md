_Projeto criado por joaolive._

# Foody Delivery

## Descrição

Aplicação full-stack de pedidos de comida desenvolvida para um desafio de vaga. Clientes podem escolher produtos, criar pedidos e acompanhar a entrega; administradores podem consultar todos os pedidos e atualizar seus status.

### Objetivos do projeto

- Entregar um fluxo completo de cadastro, autenticação, compra e acompanhamento de pedidos.
- Separar as permissões de cliente e administrador.
- Manter o ambiente de desenvolvimento e os dados de demonstração reproduzíveis.

---

## Funcionalidades

- Cadastro e login com JWT.
- Catálogo paginado de produtos e endereços salvos por cliente.
- Criação de pedidos com endereço escolhido no checkout e preços obtidos do catálogo pelo backend.
- Consulta de pedidos próprios, detalhes e cancelamento enquanto o pedido estiver recebido ou em preparo.
- Painel administrativo para consultar pedidos e atualizar seus status.
- Interface responsiva com temas claro e escuro.

### API e permissões

| Rota                                       | Acesso                | Uso                                    |
| ------------------------------------------ | --------------------- | -------------------------------------- |
| `POST /user`, `POST /auth/login`           | Público               | Cadastro e login                       |
| `GET /product`                             | Autenticado           | Catálogo paginado                      |
| `GET /addresses`, `POST /addresses`        | Autenticado           | Endereços da própria conta             |
| `POST /orders`, `GET /orders/mine`         | Cliente               | Criar e listar os próprios pedidos     |
| `GET /orders/{id}`                         | Cliente dono ou admin | Detalhes do pedido                     |
| `PATCH /orders/{id}/cancel`                | Cliente dono          | Cancelar pedido elegível               |
| `GET /orders`, `PATCH /orders/{id}/status` | Admin                 | Listagem geral e atualização de status |

`POST /orders` recebe o identificador de um endereço salvo (`addressId`) e uma lista de `{productId, quantity}`. O backend identifica o cliente pelo JWT e usa o preço atual de cada produto. As listagens retornam dados resumidos do pedido; `GET /orders/{id}` retorna endereço e itens. Os status da API são apresentados na interface assim:

| API                 | Interface         |
| ------------------- | ----------------- |
| `RECEBIDO`          | Recebido          |
| `EM_PREPARO`        | Em preparo        |
| `SAIU_PARA_ENTREGA` | Saiu para entrega |
| `ENTREGUE`          | Entregue          |
| `CANCELADO`         | Cancelado         |

---

## Escolhas técnicas

| Parte                | Escolha                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Backend              | Java 25, Spring Boot 4 e Spring Data JPA para a API e persistência.                                                 |
| Segurança            | Login local emite JWT assinado com RSA; o Spring Security Resource Server valida o token e as permissões das rotas. |
| Dados                | PostgreSQL no perfil padrão `dev` e H2 em memória no perfil `test`; ambos usam as mesmas migrações Liquibase.       |
| Frontend             | React, TypeScript, Vite e Tailwind CSS; o Vite encaminha `/api` ao backend durante o desenvolvimento.               |
| Ambiente e qualidade | Docker Compose para PostgreSQL, devcontainer opcional, testes com Maven e cobertura com JaCoCo.                     |

As migrações e os dados de demonstração são aplicados automaticamente quando o backend inicia. As chaves RSA são geradas localmente e ignoradas pelo Git.

---

## Instruções

### Requisitos

- Docker instalado e em execução, com Docker Compose disponível.
- Para usar o devcontainer: editor com suporte a Dev Containers.
- Para executar as aplicações fora do devcontainer: Java 25, Node.js 24, OpenSSL e Bash.

### Preparação

Crie o arquivo de configuração local:

```bash
cp backend/.env.example backend/.env
```

Os valores do exemplo servem apenas para desenvolvimento local. `backend/.env` é ignorado pelo Git.

### Execução

#### No devcontainer

Abra o projeto no devcontainer. Em um terminal, gere as chaves e inicie o backend:

```bash
./generate-local-keys.sh
cd backend && ./mvnw spring-boot:run
```

Em outro terminal, inicie o frontend:

```bash
cd frontend && npm ci && npm run dev
```

#### Sem devcontainer

Inicie o PostgreSQL com Docker Compose:

```bash
docker compose -f .devcontainer/docker-compose.yml up -d db
```

Em um terminal no computador, carregue as variáveis locais e inicie o backend:

```bash
set -a
source backend/.env
set +a
export SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5433/$POSTGRES_DB"
./generate-local-keys.sh
cd backend && ./mvnw spring-boot:run
```

Em outro terminal, inicie o frontend:

```bash
cd frontend && npm ci && npm run dev
```

A interface fica em `http://localhost:5173` e o backend em `http://localhost:8080`. O Vite encaminha `/api` ao backend.

### Contas de demonstração

| Perfil          | E-mail                    | Senha       |
| --------------- | ------------------------- | ----------- |
| Admin (Alex)    | `alex.green@example.com`  | `admin123`  |
| Cliente (Maria) | `maria.brown@example.com` | `client123` |

### Testes

Depois de gerar as chaves RSA no ambiente escolhido, execute os testes do backend:

```bash
cd backend && ./mvnw verify
```

O JaCoCo gera o relatório HTML em `backend/target/site/jacoco/index.html`, além de XML e CSV no mesmo diretório. O relatório reúne testes unitários e de integração; não há meta global de cobertura.

Para verificar o frontend:

```bash
cd frontend && npm ci && npm run build && npm run lint && npm run format:check
```

---

## Recursos

### Referências

- [Spring Boot](https://docs.spring.io/spring-boot/reference/index.html)
- [Spring Security Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
- [React](https://react.dev/learn)
- [Vite](https://vite.dev/guide/)
- [Liquibase Community](https://docs.liquibase.com/community)
- [Docker Compose](https://docs.docker.com/compose/)

### Uso de inteligência artificial

O OpenAI Codex foi usado como assistente de pesquisa e desenvolvimento. A IA apoiou:

- **Backend:** implementação e revisão das APIs de usuários, produtos, endereços e pedidos; análise do fluxo JWT e das permissões; remoção do Authorization Server que não era utilizado, mantendo o Resource Server.
- **Frontend:** implementação e revisão das telas de autenticação, catálogo, criação e acompanhamento de pedidos e administração, além de ajustes de navegação e responsividade.
- **Testes e ambiente:** criação de testes unitários para regras de pedidos e testes de integração da API; configuração do JaCoCo; revisão dos perfis, das migrações Liquibase e das instruções de execução.
- **Documentação:** revisão da organização do código e elaboração deste README.

O autor definiu os requisitos e as decisões de escopo. As sugestões da IA foram avaliadas e adaptadas ao projeto; o código foi verificado com testes e builds no devcontainer e permanece sob responsabilidade do autor.
