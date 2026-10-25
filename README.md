# Backend

## Docker

Com `backend/.env` preenchido, execute dentro de `backend`:

```bash
docker compose up --build -d
docker compose ps
```

A API fica em `http://localhost:3000` (ou na porta definida por `PORT`).
O Compose sobe o PostgreSQL, espera o banco ficar saudável, aplica as migrações
e então inicia o backend. `GET /health` confirma que a API consegue consultar o
PostgreSQL. O banco usa um volume persistente; `docker compose down`
para os serviços sem apagar os dados.

O Compose lê `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DATABASE_URL`
e `PORT` de `.env`. Na `DATABASE_URL` usada pelo Compose, o host deve
ser `db`, que é o nome do serviço PostgreSQL na rede interna. Mantenha nessa URL
as mesmas credenciais definidas nas variáveis `POSTGRES_*`.

## PostgreSQL

1. Crie um banco PostgreSQL e copie `.env.example` para `.env`.
2. Para executar fora do Docker, ajuste o host de `DATABASE_URL` para `localhost`.
3. Execute `pnpm install`, `pnpm db:deploy` e `pnpm dev` dentro de `backend`.

`pnpm db:deploy` aplica a migração versionada. Durante mudanças no schema, use
`pnpm db:migrate` para criar uma nova migração. `pnpm check` gera o cliente Prisma,
verifica TypeScript e valida o schema.

## API

Todos os recursos oferecem `POST /`, `GET /`, `GET /:id`, `PATCH /:id` e
`DELETE /:id`. O `POST` responde `201` com `{ "id": "..." }`; o `DELETE`
responde `204` quando remove o registro. IDs inválidos retornam `400`, registros
ausentes retornam `404` e conflitos de referências no banco retornam `409`.

| Recurso | Caminho | Campos de criação |
| --- | --- | --- |
| Product | `/products` | `name`, `description`, `price` |
| Buyer | `/buyers` | `name`, `balance` |
| Seller | `/sellers` | `name`, `product_ids` (opcional) |
| Order | `/orders` | `buyer_id`, `product_id` |
| AISeller | `/ai-sellers` | `seller_id`, `product_id` |

`PATCH` aceita qualquer subconjunto não vazio dos campos de criação. O preço e
o saldo são valores em unidade monetária com até duas casas decimais. `Seller`
associa produtos existentes; `Order` e `AISeller` referenciam registros
existentes. Produtos e compradores usados em pedidos, ou vendedores e produtos
usados em `AISeller`, não podem ser excluídos até que as referências sejam
removidas.

O cliente Prisma é gerado em `src/generated/prisma` e não é versionado.
A imagem de produção compila o TypeScript para `dist` durante o build e executa
somente o JavaScript compilado no runtime.
