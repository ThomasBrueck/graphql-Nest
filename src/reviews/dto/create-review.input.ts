import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsString, IsUUID, Max, Min, MinLength } from 'class-validator';

// Define el payload mínimo para crear reseñas autenticadas.
@InputType()
export class CreateReviewInput {
  @Field(() => String)
  @IsString()
  @MinLength(10)
  comment: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @Field(() => String)
  @IsUUID()
  movieId: string;
}
