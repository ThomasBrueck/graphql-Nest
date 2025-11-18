import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  ManyToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Entidad persistente para las reseñas creadas por los usuarios.
 */
@Entity('reviews')
@ObjectType()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('text')
  @Field(() => String)
  comment: string;

  @Column('int')
  @Field(() => Int)
  rating: number;

  @ManyToOne(() => Movie, (movie) => movie.reviews, { onDelete: 'CASCADE' })
  @Field(() => Movie)
  movie: Movie;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  updatedAt: Date;
}
