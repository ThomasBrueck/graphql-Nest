import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MoviesService } from '../movies/movies.service';
import { ReviewsService } from '../reviews/reviews.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly usersService: UsersService,
    private readonly moviesService: MoviesService,
    private readonly reviewsService: ReviewsService,
  ) {}

  async executeSeed(): Promise<boolean> {
    // Limpiar base de datos
    await this.deleteTables();

    // Crear usuarios
    const users = await this.createUsers();

    // Crear películas
    const movies = await this.createMovies();

    // Crear reseñas
    await this.createReviews(users, movies);

    return true;
  }

  async deleteDatabase(): Promise<boolean> {
    await this.deleteTables();
    return true;
  }

  private async deleteTables() {
    // Eliminar en orden inverso a las relaciones para evitar problemas de FK
    try {
      await this.reviewsService.removeAll();
      await this.moviesService.removeAll();
      await this.usersService.removeAll();
    } catch (error) {
      console.error('Error deleting tables:', error);
      throw error;
    }
  }

  private async createUsers() {
    const users = [];

    // Usuario Admin
    const admin = await this.usersService.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin123!',
      roles: ['admin'],
    });
    users.push(admin);

    // Usuarios normales
    const user1 = await this.usersService.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'User123!',
      roles: ['user'],
    });
    users.push(user1);

    const user2 = await this.usersService.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'User123!',
      roles: ['user'],
    });
    users.push(user2);

    const user3 = await this.usersService.create({
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: 'User123!',
      roles: ['user'],
    });
    users.push(user3);

    return users;
  }

  private async createMovies() {
    const movies = [];

    const movie1 = await this.moviesService.create({
      title: 'The Matrix',
      director: 'Wachowski Sisters',
      genre: 'Sci-Fi',
      releaseYear: 1999,
      duration: 136,
      description:
        'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    });
    movies.push(movie1);

    const movie2 = await this.moviesService.create({
      title: 'Inception',
      director: 'Christopher Nolan',
      genre: 'Sci-Fi',
      releaseYear: 2010,
      duration: 148,
      description:
        'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
    });
    movies.push(movie2);

    const movie3 = await this.moviesService.create({
      title: 'The Shawshank Redemption',
      director: 'Frank Darabont',
      genre: 'Drama',
      releaseYear: 1994,
      duration: 142,
      description:
        'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    });
    movies.push(movie3);

    const movie4 = await this.moviesService.create({
      title: 'The Dark Knight',
      director: 'Christopher Nolan',
      genre: 'Action',
      releaseYear: 2008,
      duration: 152,
      description:
        'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest tests.',
    });
    movies.push(movie4);

    const movie5 = await this.moviesService.create({
      title: 'Pulp Fiction',
      director: 'Quentin Tarantino',
      genre: 'Crime',
      releaseYear: 1994,
      duration: 154,
      description:
        'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    });
    movies.push(movie5);

    const movie6 = await this.moviesService.create({
      title: 'Forrest Gump',
      director: 'Robert Zemeckis',
      genre: 'Drama',
      releaseYear: 1994,
      duration: 142,
      description:
        'The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man with an IQ of 75.',
    });
    movies.push(movie6);

    return movies;
  }

  private async createReviews(users, movies) {
    // Usuario John (users[1]) revisa The Matrix
    await this.reviewsService.create(
      {
        comment:
          'Mind-blowing movie! The action sequences and philosophical themes are incredible.',
        rating: 5,
        movieId: movies[0].id,
      },
      users[1], // John
    );

    // Usuario Jane (users[2]) revisa The Matrix
    await this.reviewsService.create(
      {
        comment: 'A classic that defined a generation of sci-fi movies.',
        rating: 5,
        movieId: movies[0].id,
      },
      users[2], // Jane
    );

    // Usuario Mike (users[3]) revisa Inception
    await this.reviewsService.create(
      {
        comment:
          'Christopher Nolan at his best. Complex but rewarding storyline.',
        rating: 5,
        movieId: movies[1].id,
      },
      users[3], // Mike
    );

    // Usuario John revisa Inception
    await this.reviewsService.create(
      {
        comment: 'Great movie but can be confusing at times. Still loved it!',
        rating: 4,
        movieId: movies[1].id,
      },
      users[1], // John
    );

    // Usuario Jane revisa The Shawshank Redemption
    await this.reviewsService.create(
      {
        comment: 'The best movie ever made. Perfect in every way.',
        rating: 5,
        movieId: movies[2].id,
      },
      users[2], // Jane
    );

    // Usuario Mike revisa The Dark Knight
    await this.reviewsService.create(
      {
        comment: 'Heath Ledger gave an unforgettable performance as the Joker.',
        rating: 5,
        movieId: movies[3].id,
      },
      users[3], // Mike
    );

    // Usuario John revisa Pulp Fiction
    await this.reviewsService.create(
      {
        comment: 'Tarantino\'s masterpiece. Non-linear storytelling at its finest.',
        rating: 5,
        movieId: movies[4].id,
      },
      users[1], // John
    );

    // Usuario Jane revisa Forrest Gump
    await this.reviewsService.create(
      {
        comment: 'A heartwarming story that makes you laugh and cry.',
        rating: 5,
        movieId: movies[5].id,
      },
      users[2], // Jane
    );

    // Usuario Mike revisa The Shawshank Redemption
    await this.reviewsService.create(
      {
        comment: 'Inspiring and emotional. A must-watch for everyone.',
        rating: 5,
        movieId: movies[2].id,
      },
      users[3], // Mike
    );
  }
}
