import { AbstractRepository } from 'nest-sequelize-repository';
import { UserModel } from '../../database/models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import sequelize from 'sequelize';
import { NotFoundException } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { toUserDto } from '../dto/toUserDto';

export class UserRepository extends AbstractRepository<UserModel> {
  constructor(
    @InjectModel(UserModel) protected readonly model: typeof UserModel,
  ) {
    super(model, {
      autoGenerateId: { enable: true },
    });
  }

  public async findAllToDto(
    options?: sequelize.WhereOptions<UserModel>,
    transaction?: sequelize.Transaction,
    customError?: typeof NotFoundException,
  ): Promise<UserDto[]> {
    const users = await super.findAll(options, transaction, customError);
    return users.map((user) => toUserDto(user));
  }
}
