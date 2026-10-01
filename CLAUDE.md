# CLAUDE.md

NestJS 12 (ESM) + Apollo GraphQL (code-first) + Prisma 7 + CockroachDB.

- ESM project: relative imports use the `.js` extension.
- Prisma client is generated into `src/generated/prisma` (git-ignored); run `npx prisma generate` after schema changes.
- Schema change: edit `prisma/schema.prisma`, run `npx prisma migrate dev --name <name>`, then update GraphQL types in `src/profile/profile.models.ts`.
- Mutations are protected by `AdminGuard` (`ADMIN_TOKEN` env).
- Input validation: class-validator decorators on `@InputType` classes, global `ValidationPipe` in `AppModule`.
- Tests: `node:test`, files `src/**/*.spec.ts`, run `npm test` (no DB needed).
- Verify with `npm test` and `docker compose up --build`.
