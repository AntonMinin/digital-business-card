import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { AppModule } from './app.module.js';

const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.enableShutdownHooks();
app.useStaticAssets(join(process.cwd(), 'public'));
await app.listen(process.env.PORT ?? 3000);
