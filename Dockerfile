FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json /app/prisma.config.ts ./
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/prisma prisma
COPY --from=build /app/dist dist
COPY --from=build /app/public public
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/seed.js && node dist/main.js"]
