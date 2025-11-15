import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { Auth } from '../auth/decorators/auth/auth.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Resolver(() => Movie)
export class MoviesResolver {
  constructor(private readonly moviesService: MoviesService) {}

  @Mutation(() => Movie)
  @Auth(ValidRoles.admin)
  createMovie(@Args('createMovieInput') createMovieInput: CreateMovieInput) {
    return this.moviesService.create(createMovieInput);
  }

  @Query(() => [Movie], { name: 'movies' })
  findAll() {
    return this.moviesService.findAll();
  }

  @Query(() => Movie, { name: 'movie' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.moviesService.findOne(id);
  }

  @Mutation(() => Movie)
  @Auth(ValidRoles.admin)
  updateMovie(@Args('updateMovieInput') updateMovieInput: UpdateMovieInput) {
    return this.moviesService.update(updateMovieInput.id, updateMovieInput);
  }

  @Mutation(() => Movie)
  @Auth(ValidRoles.admin)
  removeMovie(@Args('id', { type: () => ID }) id: string) {
    return this.moviesService.remove(id);
  }
}
