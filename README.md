
Description

Wallet Service – NestJS application with TypeORM, PostgreSQL, ledger-based transfers, and idempotency.

## Wallet Service Quick Start

```bash
docker compose up -d
npm run seed
npm run start:dev
```

**API Endpoints:**
- `GET /asset-types` – list asset types (use IDs for requests)
- `GET /wallets/balance?userId=&assetTypeId=`
- `POST /wallets/top-up` – body: `{ userId, assetTypeId, amount, idempotencyKey? }`
- `POST /wallets/bonus` – body: `{ userId, assetTypeId, amount, idempotencyKey? }`
- `POST /wallets/spend` – body: `{ userId, assetTypeId, amount, idempotencyKey? }`

**Test users:** `user-1`, `user-2` (from seed)

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
