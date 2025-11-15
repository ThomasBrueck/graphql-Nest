import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(createMovieInput: CreateMovieInput): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieInput);
    return await this.movieRepository.save(movie);
  }

  async findAll(): Promise<Movie[]> {
    return await this.movieRepository.find();
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { id } });
    
    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
    
    return movie;
  }

  async update(id: string, updateMovieInput: UpdateMovieInput): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { id } });
    
    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    Object.assign(movie, updateMovieInput);
    return await this.movieRepository.save(movie);
  }

  async remove(id: string): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { id } });
    
    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
    
    const movieId = movie.id;
    await this.movieRepository.remove(movie);
    movie.id = movieId;
    return movie;
  }

  async removeAll(): Promise<void> {
    await this.movieRepository.query('TRUNCATE TABLE movies RESTART IDENTITY CASCADE;');
  }
}
