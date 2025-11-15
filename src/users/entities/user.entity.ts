import { Field, ID, ObjectType } from '@nestjs/graphql';
import { 
  BeforeInsert, 
  BeforeUpdate, 
  Column, 
  CreateDateColumn, 
  Entity, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { Review } from '../../reviews/entities/review.entity';

@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'text' })
  @Field(() => String)
  name: string;

  @Column({ unique: true, type: 'text' })
  @Field(() => String)
  email: string;

  @Column('text')
  @Field(() => String)
  password?: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  @Field(() => [String])
  roles: string[];

  @OneToMany(() => Review, (review) => review.user, { cascade: true })
  @Field(() => [Review], { nullable: true })
  reviews?: Review[];

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @Column('boolean', { default: true })
  @Field(() => Boolean)
  isActive: boolean;

  @BeforeUpdate()
  @BeforeInsert()
  checkFieldsBeforeChanges() {
    this.email = this.email.toLowerCase().trim();
  }
}
