import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UserRepository) {}

  public async createUser(dto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.password, salt);

    return this.repository.create({
      ...dto,
      password: hash,
    });
  }

  public async getUserByEmail(email: string) {
    return this.repository.findOne({ email });
  }

  public async getAllUsers() {
    return this.repository.findAllToDto();
  }
}
