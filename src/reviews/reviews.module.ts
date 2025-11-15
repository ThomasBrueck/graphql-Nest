import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsResolver } from './reviews.resolver';
import { Review } from './entities/review.entity';
import { MoviesModule } from '../movies/movies.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    MoviesModule,
    AuthModule,
  ],
  providers: [ReviewsResolver, ReviewsService],
  exports: [ReviewsService, TypeOrmModule],
})
export class ReviewsModule {}
