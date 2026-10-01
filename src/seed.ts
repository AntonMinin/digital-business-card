import { PrismaService } from './prisma.service.js';

const prisma = new PrismaService();

if ((await prisma.profile.count()) === 0) {
  await prisma.profile.create({
    data: {
      fullName: 'Anton Minin Baranovskii',
      title: 'TypeScript Backend Developer',
      location: 'Remote',
      email: 'as.minin.tt@gmail.com',
      about: 'Более 10 лет в коммерческой разработке. Специализируюсь на создании B2C/B2B-сервисов, сложных веб-интерфейсов, архитектуре систем аутентификации и интеграции AI/LLM решений. Закрываю полный цикл разработки: от требований бизнеса до стабильного продакшена. Ключевые компетенции в инженерии: проектирование UI-архитектуры, интеграция микросервисов, разработка сложных пайплайнов (RAG, LLM). Ключевые компетенции в процессах: продуктовое мышление, эффективность как в автономном режиме, так и в плотном кросс-функциональном взаимодействии. Нацелен на долгосрочное развитие внутри компании.',
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
