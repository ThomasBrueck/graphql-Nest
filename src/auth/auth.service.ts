import { 
  BadRequestException, 
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './types/auth-response.type';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);
    const token = this.getJwtToken({ id: user.id, email: user.email });

    return {
      user,
      token,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException(`User ${email} not found`);
    }

    if (!bcrypt.compareSync(password, user.password!)) {
      throw new UnauthorizedException(`Email or password incorrect`);
    }

    const token = this.getJwtToken({ id: user.id, email: user.email });

    delete user.password;

    return {
      user,
      token,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);

    if (!user) {
      throw new BadRequestException(`User not found`);
    }

    if (!user.isActive) {
      throw new UnauthorizedException(`User is not active`);
    }

    delete user.password;
    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken({ id: user.id, email: user.email });

    return {
      user,
      token,
    };
  }
}
