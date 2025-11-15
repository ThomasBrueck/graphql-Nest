import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { MoviesModule } from '../movies/movies.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { SeedResolver } from './seed.resolver';
import { SeedService } from './seed.service';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [UsersModule, MoviesModule, ReviewsModule],
})
export class SeedModule {}
