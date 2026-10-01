import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Skill {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  category!: string;
}

@ObjectType()
export class Link {
  @Field(() => ID)
  id!: string;

  @Field()
  label!: string;

  @Field()
  url!: string;
}

@ObjectType()
export class Profile {
  @Field(() => ID)
  id!: string;

  @Field()
  fullName!: string;

  @Field()
  title!: string;

  @Field()
  location!: string;

  @Field()
  email!: string;

  @Field()
  about!: string;

  @Field(() => [Skill])
  skills!: Skill[];

  @Field(() => [Link])
  links!: Link[];

  @Field()
  updatedAt!: Date;
}
