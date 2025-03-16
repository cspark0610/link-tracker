import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../models';

/**
 *
 * @param ctx
 * @returns cuando llamamos a al metodo validate de la clase LocalStrategy y retorna un UserDocument
 * la estrategia adjunta el usuario a la request, por lo que podemos obtenerlo desde el contexto
 * como request.user
 */
const getCurrentUserByContext = (ctx: ExecutionContext): UserDocument => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
};

/**
 * al usar la funcion createParamDecorator, podemos usar la fn CurrentUser como un decorador
 * @returns '@CurrentUser'
 */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  return getCurrentUserByContext(ctx);
});
