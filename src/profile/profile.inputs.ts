import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  fullName?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  about?: string;
}

@InputType()
export class AddSkillInput {
  @Field()
  name!: string;

  @Field()
  category!: string;
}
