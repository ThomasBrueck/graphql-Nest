import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';

/**
 * Formateador personalizado de errores GraphQL
 * Mapea las excepciones de NestJS a códigos de error GraphQL apropiados
 */
export const formatGraphQLError = (
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError => {
  // Si es un error de GraphQL nativo (parsing, validación), no lo modificamos
  if (
    formattedError.extensions?.code === 'GRAPHQL_PARSE_FAILED' ||
    formattedError.extensions?.code === 'GRAPHQL_VALIDATION_FAILED'
  ) {
    return formattedError;
  }

  // Obtener el error original desde formattedError.extensions
  const originalError = formattedError.extensions?.originalError;

  // Si no hay información del error original, devolver como está
  if (!originalError || typeof originalError !== 'object') {
    return formattedError;
  }

  // Obtener el statusCode del error original
  const statusCode = (originalError as any).statusCode;
  const errorName = (originalError as any).error;

  // Mapear códigos de estado HTTP a códigos de error GraphQL
  let graphqlErrorCode: string;

  switch (statusCode) {
    case 400:
      // Bad Request - Datos de entrada inválidos
      graphqlErrorCode = ApolloServerErrorCode.BAD_USER_INPUT;
      break;
    
    case 401:
      // Unauthorized - No autenticado
      graphqlErrorCode = 'UNAUTHENTICATED';
      break;
    
    case 403:
      // Forbidden - Sin permisos suficientes
      graphqlErrorCode = 'FORBIDDEN';
      break;
    
    case 404:
      // Not Found - Recurso no encontrado
      graphqlErrorCode = 'NOT_FOUND';
      break;
    
    case 409:
      // Conflict - Conflicto de recursos
      graphqlErrorCode = 'CONFLICT';
      break;
    
    case 500:
    default:
      // Internal Server Error - Error inesperado del servidor
      graphqlErrorCode = ApolloServerErrorCode.INTERNAL_SERVER_ERROR;
      break;
  }

  // Crear el error formateado con el código correcto
  return {
    ...formattedError,
    extensions: {
      ...formattedError.extensions,
      code: graphqlErrorCode,
      status: statusCode,
      originalError: {
        message: (originalError as any).message,
        error: errorName,
        statusCode: statusCode,
      },
    },
  };
};

