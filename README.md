# Digital Business Card

Цифровая визитка: NestJS + GraphQL (code-first, Apollo) + Prisma 7 + CockroachDB, упакованная в Docker.
Страница `/` — статический HTML, который берёт данные из GraphQL API.

## Запуск в Docker

```bash
ADMIN_TOKEN=secret docker compose up --build
```

- Визитка: http://localhost:3000
- GraphiQL: http://localhost:3000/graphql
- CockroachDB UI: http://localhost:8080

При старте контейнер применяет миграции и заполняет БД начальными данными (`src/seed.ts`), если профиль ещё не создан.

## Локальная разработка

```bash
cp .env.example .env
docker compose up -d db db-init
npm ci
npx prisma migrate dev
npm run build && npm run db:seed
npm run start:dev
```

## Тесты

```bash
npm test
```

Встроенный `node:test`, БД не нужна:
- `src/app.e2e.spec.ts` — поднимает приложение и проверяет GraphQL по HTTP: публичный запрос, защиту мутаций токеном, валидацию входных данных;
- `src/profile/profile.service.spec.ts` — преобразование ошибки уникальности Prisma в `409 Conflict`.

## Деплой на Render

1. Создать кластер в [CockroachDB Cloud](https://cockroachlabs.cloud) (Basic, бесплатный) и скопировать connection string.
2. В Render: **New → Blueprint**, выбрать этот репозиторий — настройки возьмутся из `render.yaml`.
3. Указать `DATABASE_URL`; `ADMIN_TOKEN` Render сгенерирует сам (виден в Environment).

Миграции и начальные данные применяются при старте контейнера.

## API

```graphql
query {
  profile {
    fullName title location email about
    skills { id name category }
    links { label url }
  }
}
```

Входные данные проверяются через `class-validator` (длина полей, формат email, UUID). Мутации требуют заголовок `Authorization: Bearer <ADMIN_TOKEN>`:

```graphql
mutation { updateProfile(input: { location: "Panama" }) { location } }
mutation { addSkill(input: { name: "Redis", category: "Data" }) { id } }
mutation { removeSkill(id: "...") }
```

## Структура

```
prisma/schema.prisma       модели Profile, Skill, Link
src/profile/               GraphQL-типы, резолвер, сервис
src/prisma.service.ts      PrismaClient с адаптером pg
src/admin.guard.ts         защита мутаций токеном
src/seed.ts                начальные данные
public/index.html          страница визитки
```
