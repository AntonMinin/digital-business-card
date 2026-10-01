import { ConflictException } from '@nestjs/common';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Prisma } from '../generated/prisma/client.js';
import type { PrismaService } from '../prisma.service.js';
import { ProfileService } from './profile.service.js';

const serviceWith = (create: () => Promise<unknown>) =>
  new ProfileService({
    profile: { findFirstOrThrow: async () => ({ id: 'p1' }) },
    skill: { create },
  } as unknown as PrismaService);

describe('ProfileService.addSkill', () => {
  it('maps a unique constraint violation to ConflictException', async () => {
    const service = serviceWith(async () => {
      throw new Prisma.PrismaClientKnownRequestError('Unique constraint failed', { code: 'P2002', clientVersion: 'test' });
    });
    await assert.rejects(service.addSkill({ name: 'Git', category: 'Tools' }), ConflictException);
  });

  it('rethrows other errors', async () => {
    const service = serviceWith(async () => {
      throw new Error('boom');
    });
    await assert.rejects(service.addSkill({ name: 'Git', category: 'Tools' }), /boom/);
  });
});
