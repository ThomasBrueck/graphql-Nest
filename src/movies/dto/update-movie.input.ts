import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsDateString, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { CreateMovieInput } from './create-movie.input';

@InputType()
export class UpdateMovieInput extends PartialType(CreateMovieInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(1)
  title?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(10)
  description?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(1)
  director?: string;

  @Field(() => String, { nullable: true })
  @IsDateString()
  @IsOptional()
  releaseDate?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(1)
  genre?: string;
}
