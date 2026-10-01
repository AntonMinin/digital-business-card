import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminGuard } from '../admin.guard.js';
import { AddSkillInput, UpdateProfileInput } from './profile.inputs.js';
import { Profile, Skill } from './profile.models.js';
import { ProfileService } from './profile.service.js';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profiles: ProfileService) {}

  @Query(() => Profile)
  profile() {
    return this.profiles.get();
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Profile)
  updateProfile(@Args('input') input: UpdateProfileInput) {
    return this.profiles.update(input);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Skill)
  addSkill(@Args('input') input: AddSkillInput) {
    return this.profiles.addSkill(input);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Boolean)
  removeSkill(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.profiles.removeSkill(id);
  }
}
