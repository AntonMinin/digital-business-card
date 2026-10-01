import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
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
  providers: [PrismaService, ProfileService, ProfileResolver],
})
export class AppModule {}
