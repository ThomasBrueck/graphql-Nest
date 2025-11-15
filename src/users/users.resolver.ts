import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { Auth } from '../auth/decorators/auth/auth.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  @Auth(ValidRoles.admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @Auth(ValidRoles.admin)
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User)
  @Auth(ValidRoles.admin)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  @Auth(ValidRoles.admin)
  removeUser(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.remove(id);
  }

  @Mutation(() => User)
  @Auth(ValidRoles.admin)
  blockUser(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.blockUser(id);
  }
}
