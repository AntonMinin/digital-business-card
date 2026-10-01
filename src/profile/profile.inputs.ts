import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Length, MaxLength, ValidateIf } from 'class-validator';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @ValidateIf((_, value) => value !== undefined)
  @Length(1, 100)
  fullName?: string;

  @Field({ nullable: true })
  @ValidateIf((_, value) => value !== undefined)
  @Length(1, 100)
  title?: string;

  @Field({ nullable: true })
  @ValidateIf((_, value) => value !== undefined)
  @Length(1, 100)
  location?: string;

  @Field({ nullable: true })
  @ValidateIf((_, value) => value !== undefined)
  @IsEmail()
  @MaxLength(254)
  email?: string;

  @Field({ nullable: true })
  @ValidateIf((_, value) => value !== undefined)
  @Length(1, 2000)
  about?: string;
}

@InputType()
export class AddSkillInput {
  @Field()
  @Length(1, 50)
  name!: string;

  @Field()
  @Length(1, 50)
  category!: string;
}
