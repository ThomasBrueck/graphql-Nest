# 🎬 GraphQL Movies API - NestJS

API GraphQL para gestión de películas, reseñas y usuarios construida con NestJS, TypeORM y PostgreSQL.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Códigos de Estado HTTP](#códigos-de-estado-http)
- [Testing](#testing)
- [Documentación](#documentación)

## Características

- ✅ **GraphQL API** con Apollo Server
- ✅ **Autenticación JWT** con roles (user/admin)
- ✅ **CRUD completo** para Películas, Reseñas y Usuarios
- ✅ **Validación de datos** con class-validator
- ✅ **Base de datos PostgreSQL** con TypeORM
- ✅ **Manejo de errores mejorado** con códigos GraphQL apropiados
- ✅ **Seed de datos** para desarrollo
- ✅ **Colección de Postman** incluida

## Tecnologías

- **NestJS** - Framework de Node.js
- **GraphQL** - Lenguaje de consultas
- **Apollo Server** - Servidor GraphQL
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **bcrypt** - Encriptación de contraseñas
- **class-validator** - Validación de DTOs

## Instalación

### Requisitos Previos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm, yarn o bun

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <tu-repositorio>
cd graphql-Nest

# 2. Instalar dependencias
bun install

# 3. Configurar variables de entorno (ver siguiente sección)

# 4. Iniciar PostgreSQL con Docker (opcional)
docker-compose up -d

# 5. Iniciar el servidor
bun run start:dev
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=graphql_movies
DB_USERNAME=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
```

## Uso

### Iniciar el Servidor

```bash
# Modo desarrollo (con hot reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

El servidor estará disponible en: `http://localhost:3000/graphql`

### Ejecutar Seed de Datos

```graphql
mutation {
  executeSeed
}
```

Esto creará:

- 2 usuarios (1 admin, 1 user normal)
- 6 películas
- 10 reseñas

### Ejemplo de Uso - Registro y Login

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

### Ejemplo de Uso - Películas

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

### Ejemplo de Uso - Reseñas

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

Para usar endpoints protegidos, agrega el header de autorización:

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

Esta API sigue las mejores prácticas de GraphQL para códigos de estado HTTP:

### Códigos HTTP

| Situación                    | HTTP Status                 |
| ---------------------------- | --------------------------- |
| Query exitosa                | `200 OK`                    |
| Error de sintaxis GraphQL    | `400 Bad Request`           |
| Errores de lógica de negocio | `200 OK` (error en payload) |
| Errores inesperados          | `500 Internal Server Error` |

### Códigos de Error en el Payload

Cuando ocurre un error, se incluye en el campo `errors` con un código específico:

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

Ejecuta el script de pruebas incluido:

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

## Docker

```bash
# Iniciar PostgreSQL con Docker
docker-compose up -d

# Detener
docker-compose down

# Ver logs
docker-compose logs -f
```

## Colección de Postman

Importa `postman_collection.json` en Postman para tener todos los endpoints listos para probar.

La colección incluye:

- ✅ Autenticación (registro y login)
- ✅ Usuarios (CRUD completo)
- ✅ Películas (CRUD completo)
- ✅ Reseñas (CRUD completo)
- ✅ Seed de datos
