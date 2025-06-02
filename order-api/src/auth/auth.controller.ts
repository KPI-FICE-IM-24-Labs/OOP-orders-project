import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { toUserDto } from './dto/toUserDto';
import { UserDto } from './dto/user.dto';
import { LocalGuard } from './guards/local.guard';
import { CurrentUser } from './decorators/currentUser.decorator';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  public async signup(@Body() dto: CreateUserDto): Promise<UserDto> {
    return toUserDto(await this.authService.signup(dto));
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalGuard)
  public async signin(@CurrentUser() user: UserDto) {
    return await this.authService.signin(user);
  }
}
