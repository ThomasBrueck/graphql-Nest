import { InputType, Field, PartialType, ID, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min, MinLength } from 'class-validator';
import { CreateReviewInput } from './create-review.input';

// Permite actualizar campos puntuales de una reseña existente.
@InputType()
export class UpdateReviewInput extends PartialType(CreateReviewInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(3)
  name?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10)
  rating?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(10)
  comment?: string;
}
