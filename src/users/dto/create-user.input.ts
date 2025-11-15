import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsArray, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  @MinLength(3)
  name: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  roles?: string[];
}
