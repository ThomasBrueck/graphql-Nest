# Informe del Proyecto GraphQL Movies API

## Resumen

API GraphQL para la gestión de películas, reseñas y usuarios construida con NestJS, TypeORM y PostgreSQL.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Uso](#uso)
- [Autenticación](#autenticación)
- [Códigos de Estado HTTP](#códigos-de-estado-http)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [Colección de Postman](#colección-de-postman)

## Características

- API GraphQL con Apollo Server
- Autenticación JWT con roles (user y admin)
- CRUD completo para películas, reseñas y usuarios
- Validación de datos con class-validator
- Persistencia en PostgreSQL mediante TypeORM
- Manejo de errores con códigos GraphQL apropiados
- Seed de datos para entornos de desarrollo
- Colección de Postman incluida para pruebas manuales

## Tecnologías

- NestJS como framework de Node.js
- GraphQL como lenguaje de consultas
- Apollo Server como servidor GraphQL
- TypeORM para la capa de datos en TypeScript
- PostgreSQL como base de datos relacional
- JWT para autenticación
- bcrypt para el hash de contraseñas
- class-validator para validar DTOs

## Uso

### Iniciar el Servidor

```bash
# Modo desarrollo (con hot reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

El servidor estará disponible en `http://localhost:3000/graphql`.

### Ejecutar Seed de Datos

```graphql
mutation {
  executeSeed
}
```

Esto crea 2 usuarios (un admin y un usuario estándar), 6 películas y 10 reseñas.

### Ejemplo de Registro y Login

```graphql
# Registro
mutation {
  signup(
    signupInput: {
      name: "Juan Perez"
      email: "juan@example.com"
      password: "Password123!"
    }
  ) {
    token
    user {
      id
      name
      email
      roles
    }
  }
}

# Login
mutation {
  login(loginInput: { email: "juan@example.com", password: "Password123!" }) {
    token
    user {
      id
      name
      email
    }
  }
}
```

### Ejemplo de Operaciones con Películas

```graphql
# Obtener todas las películas (público)
query {
  movies {
    id
    title
    description
    director
    releaseYear
    genre
  }
}

# Crear película (requiere token de admin)
mutation {
  createMovie(
    createMovieInput: {
      title: "The Matrix"
      description: "A computer hacker learns from mysterious rebels..."
      director: "Lana Wachowski"
      releaseYear: 1999
      duration: 136
      genre: "Sci-Fi"
    }
  ) {
    id
    title
  }
}
```

### Ejemplo de Operaciones con Reseñas

```graphql
# Crear reseña (requiere token de usuario)
mutation {
  createReview(
    createReviewInput: {
      comment: "Excelente película, muy recomendada!"
      rating: 5
      movieId: "abc-123-..."
    }
  ) {
    id
    comment
    rating
    movie {
      title
    }
    user {
      name
    }
  }
}

# Obtener reseñas de una película (público)
query {
  movieReviews(movieId: "abc-123-...") {
    id
    comment
    rating
    user {
      name
    }
  }
}
```

## Autenticación

Para acceder a endpoints protegidos agrega el encabezado de autorización:

```
Authorization: Bearer <tu_token_jwt>
```

En GraphQL Playground:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Códigos de Estado HTTP

Esta API sigue las mejores prácticas de GraphQL para el uso de códigos HTTP.

### Códigos HTTP

| Situación                    | HTTP Status                 |
| ---------------------------- | --------------------------- |
| Query exitosa                | `200 OK`                    |
| Error de sintaxis GraphQL    | `400 Bad Request`           |
| Errores de lógica de negocio | `200 OK` (error en payload) |
| Errores inesperados          | `500 Internal Server Error` |

### Códigos de Error en el Payload

Cuando ocurre un error, se incluye en el campo `errors` del response:

```json
{
  "errors": [
    {
      "message": "Movie with id ... not found",
      "extensions": {
        "code": "NOT_FOUND",
        "status": 404
      }
    }
  ],
  "data": null
}
```

#### Códigos de Error Disponibles

| Código                      | Descripción                | Ejemplo                   |
| --------------------------- | -------------------------- | ------------------------- |
| `GRAPHQL_VALIDATION_FAILED` | Campo inválido en la query | Campo que no existe       |
| `BAD_USER_INPUT`            | Datos de entrada inválidos | ID con formato incorrecto |
| `NOT_FOUND`                 | Recurso no encontrado      | Película que no existe    |
| `UNAUTHENTICATED`           | No autenticado             | Token ausente o inválido  |
| `FORBIDDEN`                 | Sin permisos               | Usuario sin rol admin     |
| `CONFLICT`                  | Conflicto de recursos      | Email duplicado           |
| `INTERNAL_SERVER_ERROR`     | Error inesperado           | Error de base de datos    |

### Probar Códigos de Estado

```bash
# Asegúrate de que el servidor esté corriendo
bun run start:dev

# En otra terminal
./test-http-status.sh
```

## Estructura del Proyecto

```
src/
├── auth/               # Módulo de autenticación
│   ├── decorators/     # Decoradores personalizados (@Auth, @CurrentUser)
│   ├── dto/            # DTOs de login y signup
│   ├── guards/         # Guards de JWT y roles
│   └── strategies/     # Estrategia JWT para Passport
├── common/             # Utilidades comunes
│   └── graphql-error-formatter.ts  # Formateador de errores GraphQL
├── movies/             # Módulo de películas
│   ├── dto/            # DTOs de create y update
│   ├── entities/       # Entidad Movie
│   └── movies.service.ts
├── reviews/            # Módulo de reseñas
├── seed/               # Seed de datos de prueba
├── users/              # Módulo de usuarios
└── app.module.ts       # Módulo raíz
```

## Scripts Disponibles

```bash
# Desarrollo
npm run start          # Iniciar en modo normal
npm run start:dev      # Iniciar en modo desarrollo (hot reload)
npm run start:debug    # Iniciar en modo debug

# Build
npm run build          # Compilar TypeScript

# Linting
npm run lint           # Ejecutar ESLint
npm run format         # Formatear código con Prettier
```

## Colección de Postman

Importa `postman_collection.json` para contar con todas las operaciones listas. La colección cubre:

- Autenticación (registro y login)
- Usuarios (CRUD completo)
- Películas (CRUD completo)
- Reseñas (CRUD completo)
- Seed de datos

