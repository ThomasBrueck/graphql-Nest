import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './types/auth-response.type';
import { Auth } from './decorators/auth/auth.decorator';
import { ValidRoles } from './enums/valid-roles.enum';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

// Expone las operaciones GraphQL relacionadas a autenticación.
@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signup' })
  signup(@Args('signupInput') signupInput: SignupInput) {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => AuthResponse, { name: 'login' })
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthResponse, { name: 'revalidateToken' })
  @Auth()
  revalidateToken(@CurrentUser() user: User) {
    return this.authService.revalidateToken(user);
  }
}
