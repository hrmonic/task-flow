# TaskFlow

Kanban fullstack autonome en PHP 8.2 + MySQL + Vanilla JS + Docker.

## Démarrage rapide

1. Copier la configuration:
   - `cp .env.example .env` (ou copier manuellement sous Windows)
2. Installer dépendances PHP:
   - `composer install`
3. Lancer les services:
   - `docker-compose up -d --build`
4. Exécuter les migrations puis seed:
   - `docker exec taskflow-php php database/migrate.php`
   - `docker exec taskflow-php php database/seed.php`
5. Ouvrir:
   - [http://localhost:8080](http://localhost:8080)

## Endpoints API

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### Boards
- `GET /api/boards`
- `POST /api/boards`
- `DELETE /api/boards/{id}`

### Columns
- `GET /api/boards/{id}/columns`
- `POST /api/boards/{id}/columns`
- `PATCH /api/columns/{id}`
- `DELETE /api/columns/{id}`

### Tasks
- `GET /api/columns/{id}/tasks`
- `POST /api/columns/{id}/tasks`
- `PATCH /api/tasks/{id}`
- `PATCH /api/tasks/{id}/move`
- `DELETE /api/tasks/{id}`

## Sécurité intégrée

- Password hashing: `PASSWORD_ARGON2ID`
- JWT HS256 access + refresh
- PDO prepared statements
- Ownership checks sur board/column/task
- CORS configuré
- Rate limit simple par IP (60/min)
- Security headers (nosniff, frame options, CSP)

## Vérification rapide

- Sans token: `GET /api/boards` renvoie `401`
- Avec token valide: CRUD board/column/task disponible
- Drag and drop déplace une tâche via `PATCH /api/tasks/{id}/move`
