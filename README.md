# GraphQL Movies API - NestJS

## URL Desplegada

https://graphql-nest-yuv8.onrender.com/

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


## Docker

```bash
# Iniciar PostgreSQL con Docker
docker-compose up -d

# Detener
docker-compose down

# Ver logs
docker-compose logs -f
```
