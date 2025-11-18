import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MoviesResolver } from './movies.resolver';
import { Movie } from './entities/movie.entity';
import { AuthModule } from '../auth/auth.module';

// Define el módulo de películas y sus dependencias compartidas.
@Module({
  imports: [TypeOrmModule.forFeature([Movie]), AuthModule],
  providers: [MoviesResolver, MoviesService],
  exports: [MoviesService, TypeOrmModule],
})
export class MoviesModule {}
