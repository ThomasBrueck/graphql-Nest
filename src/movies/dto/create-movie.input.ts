import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, MinLength, IsInt, Min, Max } from 'class-validator';

// Payload utilizado para registrar nuevas películas vía GraphQL.
@InputType()
export class CreateMovieInput {
  @Field(() => String)
  @IsString()
  @MinLength(1)
  title: string;

  @Field(() => String)
  @IsString()
  @MinLength(10)
  description: string;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  director: string;

  @Field(() => Int)
  @IsInt()
  @Min(1888)
  @Max(2100)
  releaseYear: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  duration: number;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  genre: string;
}
