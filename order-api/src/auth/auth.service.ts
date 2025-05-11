import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDto } from './dto/user.dto';
import { IPayload } from './IPayload';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users/users.service';
import { toUserDto } from './dto/toUserDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger: Logger = new Logger(this.constructor.name);

  public async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.usersService.getUserByEmail(email).catch((e) => {
      this.logger.error(e);
      if (
        e instanceof HttpException &&
        (e.getStatus() as HttpStatus) === HttpStatus.INTERNAL_SERVER_ERROR
      ) {
        throw e;
      }
      throw new UnauthorizedException('Credentials are incorrect');
    });

    const pwMath = await bcrypt.compare(password, user.password);

    if (!pwMath) {
      throw new UnauthorizedException('Credentials are incorrect');
    }

    return toUserDto(user);
  }

  public signup(dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  public async signin(user: UserDto): Promise<{ auth_token: string }> {
    const payload: IPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return { auth_token: await this.jwtService.signAsync(payload) };
  }
}
