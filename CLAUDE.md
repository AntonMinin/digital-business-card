# CLAUDE.md

NestJS 12 (ESM) + Apollo GraphQL (code-first) + Prisma 7 + CockroachDB.

- ESM project: relative imports use the `.js` extension.
- Prisma client is generated into `src/generated/prisma` (git-ignored); run `npx prisma generate` after schema changes.
- Schema change: edit `prisma/schema.prisma`, run `npx prisma migrate dev --name <name>`, then update GraphQL types in `src/profile/profile.models.ts`.
- CockroachDB v26+ creates tables with `schema_locked = true`, which blocks adding foreign keys in the same migration. A migration that creates tables must start with `SET create_table_with_schema_locked = false;`.
- Mutations are protected by `AdminGuard` (`ADMIN_TOKEN` env).
- Input validation: class-validator decorators on `@InputType` classes, global `ValidationPipe` in `AppModule`.
- Tests: `node:test`, files `src/**/*.spec.ts`, run `npm test` (no DB needed).
- Verify with `npm test` and `docker compose up --build`.
