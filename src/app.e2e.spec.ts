import 'reflect-metadata';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it, mock } from 'node:test';
import { AppModule } from './app.module.js';
import { PrismaService } from './prisma.service.js';
import { ProfileService } from './profile/profile.service.js';

const profile = {
  id: '1',
  fullName: 'Test User',
  title: 'Dev',
  location: 'Remote',
  email: 'test@example.com',
  about: 'About',
  skills: [],
  links: [],
  updatedAt: new Date('2026-01-01'),
};

const profiles = {
  get: mock.fn(async () => profile),
  update: mock.fn(async (input: object) => ({ ...profile, ...input })),
  addSkill: mock.fn(async (input: object) => ({ id: '2', ...input })),
  removeSkill: mock.fn(async () => true),
};

describe('GraphQL API', () => {
  let app: INestApplication;
  let url: string;

  const gql = async (query: string, token?: string) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ query }),
    });
    return res.json() as Promise<{ data?: any; errors?: { message: string; extensions: { code: string; originalError?: { message: string | string[] } } }[] }>;
  };

  before(async () => {
    process.env.ADMIN_TOKEN = 'test-token';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue({})
      .overrideProvider(ProfileService)
      .useValue(profiles)
      .compile();
    app = moduleRef.createNestApplication({ logger: false });
    await app.listen(0);
    url = `${await app.getUrl()}/graphql`.replace('[::1]', 'localhost');
  });

  after(() => app.close());

  beforeEach(() => Object.values(profiles).forEach((fn) => fn.mock.resetCalls()));

  it('returns the profile publicly', async () => {
    const { data } = await gql('{ profile { fullName email } }');
    assert.deepEqual(data.profile, { fullName: 'Test User', email: 'test@example.com' });
  });

  it('rejects mutations without a token', async () => {
    const { errors } = await gql('mutation { updateProfile(input: { location: "Panama" }) { location } }');
    assert.equal(errors?.[0].extensions.code, 'FORBIDDEN');
    assert.equal(profiles.update.mock.callCount(), 0);
  });

  it('rejects mutations with a wrong token', async () => {
    const { errors } = await gql('mutation { removeSkill(id: "00000000-0000-0000-0000-000000000000") }', 'wrong');
    assert.equal(errors?.[0].extensions.code, 'FORBIDDEN');
  });

  it('updates the profile with a valid token and input', async () => {
    const { data, errors } = await gql('mutation { updateProfile(input: { location: "Panama" }) { location } }', 'test-token');
    assert.equal(errors, undefined);
    assert.equal(data.updateProfile.location, 'Panama');
    assert.deepEqual({ ...profiles.update.mock.calls[0].arguments[0] }, { location: 'Panama' });
  });

  const invalid: [string, string, string][] = [
    ['malformed email', 'updateProfile(input: { email: "not-an-email" }) { email }', 'email must be an email'],
    ['null name', 'updateProfile(input: { fullName: null }) { fullName }', 'fullName must be longer than or equal to 1 characters'],
    ['empty name', 'updateProfile(input: { fullName: "" }) { fullName }', 'fullName must be longer than or equal to 1 characters'],
    ['too long about', `updateProfile(input: { about: "${'a'.repeat(2001)}" }) { about }`, 'about must be shorter than or equal to 2000 characters'],
    ['too long skill name', `addSkill(input: { name: "${'a'.repeat(51)}", category: "Data" }) { id }`, 'name must be shorter than or equal to 50 characters'],
  ];

  for (const [name, mutation, message] of invalid) {
    it(`rejects ${name}`, async () => {
      const { errors } = await gql(`mutation { ${mutation} }`, 'test-token');
      assert.equal(errors?.[0].extensions.code, 'BAD_REQUEST');
      assert.deepEqual(errors?.[0].extensions.originalError?.message, [message]);
      assert.equal(profiles.update.mock.callCount() + profiles.addSkill.mock.callCount(), 0);
    });
  }

  it('rejects a non-UUID skill id', async () => {
    const { errors } = await gql('mutation { removeSkill(id: "42") }', 'test-token');
    assert.equal(errors?.[0].extensions.code, 'BAD_REQUEST');
    assert.equal(profiles.removeSkill.mock.callCount(), 0);
  });
});
