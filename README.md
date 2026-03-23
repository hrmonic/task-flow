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

## Developpement local (PHP built-in server)

Depuis la racine du projet, **utilise le router dédié** (recommandé) pour que `/assets/*` soit servi avec les bons types MIME:

```bash
php -S localhost:8080 -t public public/router.php
```

Alternative (moins fiable selon l’OS): `php -S localhost:8080 -t public public/index.php` — `index.php` tente aussi de servir `/assets/` manuellement.

Verification: `http://localhost:8080/assets/css/auth.css` doit renvoyer du **CSS** (`text/css`), pas du **JSON**.

**Sans CSS charge**, la classe `.hidden` ne masque rien: l’app utilise l’attribut HTML `hidden` pour le board / logout tant que le JS n’a pas fini, afin d’éviter d’afficher le Kanban avant connexion.

## Endpoints API

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### Boards
- `GET /api/boards`
- `POST /api/boards`
- `PATCH /api/boards/{id}` (champs partiels : `name`, `description`)
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
- JWT HS256 access + refresh (`JWT_SECRET` obligatoire non trivial si `APP_ENV=prod`)
- PDO prepared statements
- Ownership checks sur board/column/task
- CORS configuré
- Rate limit simple par IP (60/min)
- Security headers (nosniff, frame options, CSP)
- CSRF : l’UI auth et le Kanban passent par l’API JSON + JWT ; pas de formulaires POST classiques vers PHP. Un service `CsrfService` est disponible si vous ajoutez des pages HTML avec soumission serveur.

## Vérification rapide

- Sans token: `GET /api/boards` renvoie `401`
- Avec token valide: CRUD board/column/task disponible
- Drag and drop déplace une tâche via `PATCH /api/tasks/{id}/move`
