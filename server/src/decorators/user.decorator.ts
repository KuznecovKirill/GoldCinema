import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//Декоратор для пользователя
export const UserDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);