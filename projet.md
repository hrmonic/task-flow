Projet 03 — TaskFlow
Kanban fullstack PHP — PHP 8.2 + MySQL + Vanilla JS drag & drop + Docker
╔══════════════════════════════════════════════════════════════════════════╗
║             CURSOR STARTER PROMPT — PROJET 03 : TASKFLOW                 ║
╚══════════════════════════════════════════════════════════════════════════╝

Tu es un expert en développement fullstack PHP 8.2 moderne (OOP, PSR, types
stricts) et architecture REST API. Tu vas créer "TaskFlow" — un Kanban
minimaliste mais robuste, sécurisé, avec authentification JWT, drag & drop
natif et déploiement Docker.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTIVATION AGENTS CURSOR (.cursor/rules)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Crée le fichier .cursor/rules :
```yaml
# .cursor/rules — TaskFlow Multi-Agent Configuration
agents:
  php_architect:
    role: "Senior PHP 8.2 Backend Architect"
    focus: "architecture MVC, PSR-4 autoload, types stricts, patterns"
    triggers: ["php", "backend", "architecture", "classe", "modèle"]
    rules:
      - "declare(strict_types=1) dans TOUS les fichiers PHP"
      - "Types de retour explicites sur toutes les méthodes"
      - "Repository Pattern : Model ≠ Database logic"
      - "PSR-4 autoloading via composer"
      - "Exceptions custom typées (TaskNotFoundException, etc.)"
      - "Pas de query SQL dans les contrôleurs : uniquement dans les repositories"

  api_expert:
    role: "REST API Security Specialist"
    focus: "routing, JWT, validation, CORS, sécurité"
    triggers: ["api", "route", "endpoint", "jwt", "auth", "sécurité"]
    rules:
      - "JWT avec clé secrète en .env (jamais hardcodée)"
      - "Validation des inputs : chaque champ validé avant tout traitement"
      - "Réponses JSON uniformes : {success, data, error, meta}"
      - "CORS configuré explicitement (pas de wildcard en prod)"
      - "Rate limiting basique : max 60 req/min par IP via Redis ou file"
      - "Sanitisation : htmlspecialchars() sur toutes les sorties HTML"

  db_expert:
    role: "MySQL Database Design Specialist"
    focus: "schéma SQL, migrations, index, requêtes optimisées"
    triggers: ["sql", "base de données", "migration", "table", "index", "requête"]
    rules:
      - "Clés étrangères avec ON DELETE CASCADE explicite"
      - "Index sur toutes les FK et les colonnes de tri fréquent"
      - "Migrations versionnées dans /database/migrations/"
      - "Prepared statements PDO UNIQUEMENT (jamais de query interpolée)"
      - "ENUM MySQL pour les statuts (todo, in_progress, done, archived)"

  frontend_expert:
    role: "Vanilla JS + CSS Frontend Specialist"
    focus: "drag & drop API, fetch async, CSS Kanban layout"
    triggers: ["frontend", "javascript", "drag", "css", "interface", "kanban"]
    rules:
      - "Drag & Drop API native (HTML5 DnD) : pas de lib externe"
      - "Fetch avec async/await, AbortController pour annulation"
      - "State management minimal : objet JS central 'AppState'"
      - "Optimistic UI : mise à jour visuelle immédiate avant confirmation API"
      - "CSS Grid pour le layout Kanban (colonnes = auto-fill)"
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHITECTURE À GÉNÉRER (mode multi-tâches simultané)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lance SIMULTANÉMENT les 4 agents :

[AGENT PHP_ARCHITECT] → Structure backend complète :

  taskflow/
  ├── .cursor/rules
  ├── docker-compose.yml                ← PHP 8.2-fpm + MySQL 8 + Nginx
  ├── docker/
  │   ├── nginx/default.conf
  │   └── php/Dockerfile
  ├── .env.example                      ← DB_HOST, JWT_SECRET, APP_ENV
  ├── composer.json                     ← PSR-4 autoload + vlucas/phpdotenv
  ├── public/
  │   ├── index.php                     ← Front controller unique
  │   ├── assets/
  │   │   ├── css/
  │   │   │   ├── tokens.css
  │   │   │   ├── layout.css
  │   │   │   ├── kanban.css
  │   │   │   ├── auth.css
  │   │   │   └── components.css
  │   │   └── js/
  │   │       ├── api.js                ← Client API fetch wrapper
  │   │       ├── auth.js               ← Login/logout/token storage
  │   │       ├── kanban.js             ← Drag & drop + rendu colonnes
  │   │       ├── taskModal.js          ← Modal création/édition tâche
  │   │       └── app.js               ← Entry point + AppState
  ├── src/
  │   ├── Config/
  │   │   ├── Database.php              ← Singleton PDO configuré
  │   │   └── Router.php               ← Router RESTful (method + path)
  │   ├── Controllers/
  │   │   ├── AuthController.php        ← POST /auth/login, /auth/register, /auth/refresh
  │   │   ├── BoardController.php       ← GET /boards, POST /boards, DELETE /boards/{id}
  │   │   ├── ColumnController.php      ← CRUD colonnes
  │   │   └── TaskController.php        ← CRUD tâches + PATCH /tasks/{id}/move
  │   ├── Models/
  │   │   ├── User.php
  │   │   ├── Board.php
  │   │   ├── Column.php
  │   │   └── Task.php
  │   ├── Repositories/
  │   │   ├── UserRepository.php        ← findByEmail, create, updateLastLogin
  │   │   ├── BoardRepository.php       ← findByUser, create, delete
  │   │   ├── ColumnRepository.php      ← findByBoard, create, reorder
  │   │   └── TaskRepository.php        ← findByColumn, create, update, move, delete
  │   ├── Middleware/
  │   │   ├── AuthMiddleware.php        ← Vérifie JWT sur routes protégées
  │   │   ├── CorsMiddleware.php        ← Headers CORS configurables
  │   │   └── RateLimitMiddleware.php   ← 60 req/min par IP
  │   ├── Services/
  │   │   ├── JwtService.php            ← encode/decode/validate JWT HS256
  │   │   ├── ValidationService.php     ← Règles de validation réutilisables
  │   │   └── ResponseService.php       ← Helpers json_response(), error_response()
  │   └── Exceptions/
  │       ├── NotFoundException.php
  │       ├── UnauthorizedException.php
  │       └── ValidationException.php
  ├── database/
  │   ├── migrations/
  │   │   ├── 001_create_users.sql
  │   │   ├── 002_create_boards.sql
  │   │   ├── 003_create_columns.sql
  │   │   └── 004_create_tasks.sql
  │   └── seeds/
  │       └── demo_data.sql             ← Board démo avec tâches exemple
  └── README.md

[AGENT API_EXPERT] → Endpoints REST complets :

  AUTH (public) :
  POST /api/auth/register    → {name, email, password} → JWT + user
  POST /api/auth/login       → {email, password} → JWT + refresh_token
  POST /api/auth/refresh     → {refresh_token} → nouveau JWT

  BOARDS (protégé JWT) :
  GET    /api/boards          → liste boards de l'utilisateur connecté
  POST   /api/boards          → {name, description?} → board créé
  DELETE /api/boards/{id}     → supprime board + colonnes + tâches (cascade)

  COLUMNS :
  GET    /api/boards/{id}/columns    → colonnes ordonnées
  POST   /api/boards/{id}/columns    → {name, color?} → colonne créée
  PATCH  /api/columns/{id}           → {name?, position?}
  DELETE /api/columns/{id}

  TASKS :
  GET    /api/columns/{id}/tasks     → tâches ordonnées avec assignees
  POST   /api/columns/{id}/tasks     → {title, description?, priority?, due_date?}
  PATCH  /api/tasks/{id}             → mise à jour partielle (title, description, priority)
  PATCH  /api/tasks/{id}/move        → {column_id, position} ← endpoint dédié au DnD
  DELETE /api/tasks/{id}

  Toutes les réponses : {"success": bool, "data": any, "error": string|null, "meta": {...}}

[AGENT DB_EXPERT] → Schéma SQL optimisé :

  users : id (UUID), name, email (UNIQUE), password_hash, created_at, last_login_at
  boards : id (UUID), user_id (FK), name, description, created_at, updated_at
  columns : id (UUID), board_id (FK), name, position (INT), color (#hex), created_at
  tasks : id (UUID), column_id (FK), title, description (TEXT), priority (ENUM low/medium/high/urgent),
          position (INT), due_date (DATE NULL), created_at, updated_at
  
  Index : boards(user_id), columns(board_id, position), tasks(column_id, position, due_date)
  UUIDs générés en PHP (ramsey/uuid ou bin2hex(random_bytes(16)))

[AGENT FRONTEND_EXPERT] → Interface Kanban complète :

  kanban.js :
  - renderBoard(boardData) : génère les colonnes + cartes depuis l'API
  - initDragAndDrop() : dragstart/dragover/drop sur colonnes et cartes
  - onTaskDrop(taskId, newColumnId, newPosition) : appelle PATCH /tasks/{id}/move
  - Optimistic UI : déplace visuellement la carte AVANT la réponse API, rollback si erreur
  - Indicateur de drop zone : highlight colonne cible pendant le drag

  taskModal.js :
  - Modal création : title (required), description (markdown textarea), priority (select), due_date
  - Modal édition : pré-remplie, PUT partiel à la fermeture si modification
  - Validation côté client avant envoi
  - Badge priorité coloré : urgent=rouge, high=orange, medium=bleu, low=gris

  CSS Kanban :
  - Layout : display:grid, grid-auto-flow:column, grid-auto-columns:280px
  - Scroll horizontal smooth sur le board
  - Cards : border-left 4px coloré par priorité, hover elevation
  - Colonnes : header sticky, compteur tâches, bouton + ajout rapide en bas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SÉCURITÉ OBLIGATOIRE (checklist à implémenter)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Passwords : password_hash(PASSWORD_ARGON2ID) + password_verify()
□ JWT : HS256, exp 15min, refresh token 7j en httpOnly cookie
□ PDO : prepared statements sur TOUTES les requêtes SQL
□ CSRF : token CSRF sur les formulaires HTML (hors API JSON)
□ Headers sécurité : X-Content-Type-Options, X-Frame-Options, CSP basique
□ Validation : chaque input validé (longueur, format, type) avant traitement
□ Autorisations : vérifier que l'user connecté possède la ressource demandée
□ .env : jamais committé (dans .gitignore), .env.example fourni

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMANDES DE DÉMARRAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

git clone / créer le dossier taskflow
composer install
cp .env.example .env && nano .env
docker-compose up -d
docker exec taskflow-php php database/migrate.php
# → http://localhost:8080