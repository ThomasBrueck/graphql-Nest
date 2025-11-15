import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  Logger, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      const { password, roles, ...userData } = createUserInput;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        roles: roles && roles.length > 0 ? roles : ['user'],
      });

      await this.userRepository.save(user);
      delete user.password;

      return user;
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    users.forEach(user => delete user.password);
    return users;
  }

  async findOneById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      delete user.password;
      return user;
    } catch (error) {
      this.handleException(error);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email.toLowerCase().trim() },
        select: { id: true, email: true, password: true, name: true, roles: true, isActive: true },
      });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      return user;
    } catch (error) {
      this.handleException(error);
    }
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      if (updateUserInput.password) {
        updateUserInput.password = bcrypt.hashSync(updateUserInput.password, 10);
      }

      Object.assign(user, updateUserInput);
      await this.userRepository.save(user);

      delete user.password;
      return user;
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOneById(id);
    const userId = user.id;
    await this.userRepository.remove(user);
    user.id = userId;
    return user;
  }

  async blockUser(id: string): Promise<User> {
    const user = await this.findOneById(id);
    user.isActive = false;
    await this.userRepository.save(user);
    return user;
  }

  async removeAll(): Promise<void> {
    await this.userRepository.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');
  }

  private handleException(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }

    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
