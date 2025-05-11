import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import e from 'express';
import { UserDto } from '../dto/user.dto';

export const CurrentUser = createParamDecorator(
  (data: keyof UserDto, context: ExecutionContext) => {
    const request: e.Request = context.switchToHttp().getRequest();
    const user: UserDto = request.user as UserDto;
    return data ? user[data] : user;
  },
);
