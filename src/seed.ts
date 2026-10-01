import { PrismaService } from './prisma.service.js';

const prisma = new PrismaService();

if ((await prisma.profile.count()) === 0) {
  await prisma.profile.create({
    data: {
      fullName: 'Anton Minin Baranovskii',
      title: 'TypeScript Backend Developer',
      location: 'Remote',
      email: 'you@example.com',
      about: 'Backend-разработчик на TypeScript. Проектирую API на NestJS и GraphQL, работаю с реляционными БД через Prisma, упаковываю сервисы в Docker.',
      skills: {
        create: [
          { name: 'TypeScript', category: 'Language' },
          { name: 'Node.js', category: 'Runtime' },
          { name: 'NestJS', category: 'Framework' },
          { name: 'GraphQL', category: 'API' },
          { name: 'Prisma', category: 'Data' },
          { name: 'CockroachDB', category: 'Data' },
          { name: 'PostgreSQL', category: 'Data' },
          { name: 'Docker', category: 'DevOps' },
          { name: 'Git', category: 'Tools' },
          { name: 'Claude Code', category: 'Tools' },
        ],
      },
      links: {
        create: [{ label: 'GraphQL API', url: '/graphql' }],
      },
    },
  });
  console.log('Seeded profile');
}

await prisma.$disconnect();
