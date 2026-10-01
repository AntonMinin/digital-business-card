import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma.service.js';
import { AddSkillInput, UpdateProfileInput } from './profile.inputs.js';

const include = {
  skills: { orderBy: [{ category: 'asc' }, { name: 'asc' }] },
  links: true,
} satisfies Prisma.ProfileInclude;

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  get() {
    return this.prisma.profile.findFirstOrThrow({ include });
  }

  async update(data: UpdateProfileInput) {
    const { id } = await this.get();
    return this.prisma.profile.update({ where: { id }, data, include });
  }

  async addSkill(data: AddSkillInput) {
    const { id } = await this.get();
    try {
      return await this.prisma.skill.create({ data: { ...data, profileId: id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(`Skill "${data.name}" already exists`);
      }
      throw e;
    }
  }

  async removeSkill(id: string) {
    const { count } = await this.prisma.skill.deleteMany({ where: { id } });
    return count > 0;
  }
}
