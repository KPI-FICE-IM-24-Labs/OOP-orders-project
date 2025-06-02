import { UserModel } from '../../database/models/user.model';
import { UserDto } from './user.dto';

export const toUserDto = (user: UserModel): UserDto => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};
