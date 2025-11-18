import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

// Tipo GraphQL devuelto tras un login/signup satisfactorio.
@ObjectType()
export class AuthResponse {
  @Field(() => User)
  user: User;

  @Field(() => String)
  token: string;
}
