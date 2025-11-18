import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  Logger 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { Review } from './entities/review.entity';
import { Movie } from '../movies/entities/movie.entity';
import { User } from '../users/entities/user.entity';

/**
 * Servicio que centraliza la lógica de negocio de las reseñas.
 */
@Injectable()
export class ReviewsService {
  private readonly logger = new Logger('ReviewsService');

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(createReviewInput: CreateReviewInput, user: User): Promise<Review> {
    try {
      const movie = await this.movieRepository.findOneBy({ 
        id: createReviewInput.movieId 
      });

      if (!movie) {
        throw new NotFoundException(
          `Movie with ID ${createReviewInput.movieId} not found`
        );
      }

      // Verificar si el usuario ya ha hecho una reseña para esta película
      const existingReview = await this.reviewRepository.findOne({
        where: {
          movie: { id: movie.id },
          user: { id: user.id },
        },
      });

      if (existingReview) {
        throw new BadRequestException('User has already reviewed this movie');
      }

      const { movieId, ...reviewData } = createReviewInput;

      const review = this.reviewRepository.create({
        ...reviewData,
        movie,
        user,
      });

      const saved = await this.reviewRepository.save(review);

      // Cargar la review completa con sus relaciones
      const result = await this.reviewRepository.findOne({
        where: { id: saved.id },
        relations: ['movie', 'user'],
      });

      // Sanitizar datos sensibles
      if (result && result.user) delete result.user.password;

      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAll(): Promise<Review[]> {
    const reviews = await this.reviewRepository.find({
      relations: ['movie', 'user'],
    });

    return reviews.map((r) => {
      if (r.user) delete r.user.password;
      return r;
    });
  }

  async findOne(id: string): Promise<Review> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['movie', 'user'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    if (review.user) delete review.user.password;

    return review;
  }

  async update(
    id: string,
    updateReviewInput: UpdateReviewInput,
    user: User,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    if (review.user.id !== user.id) {
      throw new BadRequestException('You can only update your own reviews');
    }

    Object.assign(review, updateReviewInput);
    const saved = await this.reviewRepository.save(review);

    const result = await this.reviewRepository.findOne({
      where: { id: saved.id },
      relations: ['movie', 'user'],
    });

    if (result && result.user) delete result.user.password;

    return result;
  }

  async remove(id: string, user: User): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Permitir eliminación si es el dueño O si es admin
    const isAdmin = user.roles.includes('admin');
    const isOwner = review.user.id === user.id;

    if (!isOwner && !isAdmin) {
      throw new BadRequestException('You can only delete your own reviews');
    }

    await this.reviewRepository.remove(review);
    return { ...review, id };
  }

  async getMovieReviews(movieId: string): Promise<Review[]> {
    if (!isUUID(movieId)) {
      throw new BadRequestException('Invalid movie ID format');
    }

    const movie = await this.movieRepository.findOne({
      where: { id: movieId },
      relations: ['reviews', 'reviews.user'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    if (movie.reviews && movie.reviews.length) {
      movie.reviews = movie.reviews.map((r) => {
        if (r.user) delete r.user.password;
        return r;
      });
    } else {
      movie.reviews = [];
    }

    return movie.reviews;
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const reviews = await this.reviewRepository.find({
      where: { user: { id: userId } },
      relations: ['movie', 'user'],
    });

    return reviews.map((r) => {
      if (r.user) delete r.user.password;
      return r;
    });
  }

  async removeAll(): Promise<void> {
    await this.reviewRepository.query('TRUNCATE TABLE reviews RESTART IDENTITY CASCADE;');
  }
}
