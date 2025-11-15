import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { Auth } from '../auth/decorators/auth/auth.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Mutation(() => Review)
  @Auth()
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.create(createReviewInput, user);
  }

  @Query(() => [Review], { name: 'reviews' })
  findAll() {
    return this.reviewsService.findAll();
  }

  @Query(() => Review, { name: 'review' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.reviewsService.findOne(id);
  }

  @Mutation(() => Review)
  @Auth()
  updateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.update(updateReviewInput.id, updateReviewInput, user);
  }

  @Mutation(() => Review)
  @Auth()
  removeReview(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.remove(id, user);
  }

  @Query(() => [Review], { name: 'movieReviews' })
  getMovieReviews(@Args('movieId', { type: () => ID }) movieId: string) {
    return this.reviewsService.getMovieReviews(movieId);
  }

  @Query(() => [Review], { name: 'userReviews' })
  @Auth(ValidRoles.admin)
  getUserReviews(@Args('userId', { type: () => ID }) userId: string) {
    return this.reviewsService.getUserReviews(userId);
  }
}
