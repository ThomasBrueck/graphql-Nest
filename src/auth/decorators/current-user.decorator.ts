import { 
  createParamDecorator, 
  ExecutionContext, 
  InternalServerErrorException 
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// Extrae el usuario autenticado del contexto GraphQL.
export const CurrentUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    if (!user) {
      throw new InternalServerErrorException('No user inside the request');
    }

    return data ? user[data] : user;
  },
);
