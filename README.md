# Foody Delivery

Mini rastreador de pedidos para o desafio Full-Stack. O backend usa Java 25, Spring Boot, PostgreSQL e Liquibase; o frontend usa React, TypeScript e Vite.

## Executar no devcontainer

Antes de abrir o projeto no devcontainer, crie o arquivo local de configuração:

```bash
cp backend/.env.example backend/.env
```

Os valores do exemplo servem apenas para desenvolvimento local. `backend/.env` é ignorado pelo Git. Abra a pasta no devcontainer e, em terminais separados dentro dele, execute:

```bash
./generate-local-keys.sh
cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

```bash
cd frontend && npm ci && npm run dev
```

A interface fica em `http://localhost:5173`. O Vite encaminha `/api` ao backend na porta 8080. O perfil `dev` usa o PostgreSQL do devcontainer; o perfil padrão `test` usa H2 em memória. Ambos aplicam as mesmas migrações Liquibase e carregam dados de demonstração. As chaves RSA geradas são locais e ignoradas pelo Git.

## Contas de demonstração

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Admin (Alex) | `alex.green@example.com` | `admin123` |
| Cliente (Maria) | `maria.brown@example.com` | `client123` |

O cliente pode cadastrar outra conta pela interface. A conta admin permite ver todos os pedidos e atualizar seus status; a conta cliente cria pedidos, consulta os próprios pedidos e pode cancelá-los enquanto estiverem recebidos ou em preparo.

## API e decisões

O login em `POST /auth/login` recebe e-mail e senha e retorna um JWT. O frontend envia esse token como `Authorization: Bearer ...`; o Resource Server valida o token nas rotas protegidas. O cadastro em `POST /user` e o login são públicos.

| Rota | Acesso | Uso |
| --- | --- | --- |
| `GET /product` | Autenticado | Catálogo paginado |
| `GET /addresses`, `POST /addresses` | Autenticado | Endereços da própria conta |
| `POST /orders`, `GET /orders/mine` | Cliente | Criar e listar os próprios pedidos |
| `GET /orders/{id}` | Cliente dono ou admin | Detalhes do pedido |
| `PATCH /orders/{id}/cancel` | Cliente dono | Cancelar pedido elegível |
| `GET /orders`, `PATCH /orders/{id}/status` | Admin | Listagem geral e atualização de status |

`POST /orders` recebe `addressId` de um endereço salvo pelo cliente e uma lista de `{productId, quantity}`. O backend obtém o cliente do JWT e o preço atual do catálogo. A API mantém os valores de status em inglês; a interface mostra os nomes pedidos no enunciado:

| API | Interface |
| --- | --- |
| `RECEIVED` | Recebido |
| `PREPARING` | Em preparo |
| `OUT_FOR_DELIVERY` | Saiu para entrega |
| `DELIVERED` | Entregue |
| `CANCELED` | Cancelado |

## Verificar

Execute no devcontainer, após gerar as chaves RSA:

```bash
cd backend && ./mvnw verify
```

O JaCoCo inclui os testes unitários e de integração e gera o relatório HTML em `backend/target/site/jacoco/index.html`, além de XML e CSV no mesmo diretório. Não há meta global de cobertura: o relatório serve para identificar regras importantes ainda sem teste.

```bash
cd frontend && npm run build && npm run lint && npm run format:check
```

As migrações são aplicadas automaticamente quando o backend inicia. Não é preciso executar SQL manualmente para os dados de demonstração.
