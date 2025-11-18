import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { Movie } from './entities/movie.entity';

/**
 * Orquesta la lógica de persistencia para las películas expuestas por GraphQL.
 */
@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  // Registra una película nueva a partir de los datos validados del DTO.
  async create(createMovieInput: CreateMovieInput): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieInput);
    return await this.movieRepository.save(movie);
  }

  async findAll(): Promise<Movie[]> {
    return await this.movieRepository.find();
  }

  // Obtiene una película por ID validando su existencia.
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

  // Elimina una película y regresa el registro borrado.
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

  // Utilizado en pruebas/seed para limpiar la tabla de películas.
  async removeAll(): Promise<void> {
    await this.movieRepository.query('TRUNCATE TABLE movies RESTART IDENTITY CASCADE;');
  }
}
