import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import e from 'express';
import { IPayload } from '../IPayload';

export const CurrentUser = createParamDecorator(
  (data: keyof IPayload, context: ExecutionContext) => {
    const request: e.Request = context.switchToHttp().getRequest();
    const user: IPayload = request.user as IPayload;
    return data ? user[data] : user;
  },
);
