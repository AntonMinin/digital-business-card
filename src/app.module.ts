import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaService } from './prisma.service.js';
import { ProfileResolver } from './profile/profile.resolver.js';
import { ProfileService } from './profile/profile.service.js';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      graphiql: true,
      context: ({ req }: { req: unknown }) => ({ req }),
    }),
  ],
  providers: [
    PrismaService,
    ProfileService,
    ProfileResolver,
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }) },
  ],
})
export class AppModule {}
