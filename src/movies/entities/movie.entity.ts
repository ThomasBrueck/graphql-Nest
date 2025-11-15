import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { Review } from '../../reviews/entities/review.entity';

@Entity('movies')
@ObjectType()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('text')
  @Field(() => String)
  title: string;

  @Column('text')
  @Field(() => String)
  description: string;

  @Column('text')
  @Field(() => String)
  director: string;

  @Column('int')
  @Field(() => Int)
  releaseYear: number;

  @Column('int')
  @Field(() => Int)
  duration: number;

  @Column('text')
  @Field(() => String)
  genre: string;

  @OneToMany(() => Review, (review) => review.movie, { cascade: true })
  @Field(() => [Review], { nullable: true })
  reviews?: Review[];

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
