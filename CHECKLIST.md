# TaskFlow Delivery Checklist

## Fonctionnel
- [x] Auth: register/login/refresh
- [x] Boards: list/create/delete
- [x] Columns: list/create/update/delete
- [x] Tasks: list/create/update/move/delete
- [x] UI Kanban: rendu colonnes + cartes
- [x] Drag and drop: endpoint move appelé

## Sécurité
- [x] Hashing password en Argon2id
- [x] JWT access + refresh
- [x] Prepared statements PDO
- [x] Ownership checks board/column/task
- [x] CORS configuré
- [x] Rate limit simple par IP
- [x] Security headers
- [x] `.env.example` fourni

## Data & infra
- [x] Migrations versionnées SQL
- [x] FKs + cascade + index
- [x] Seed de démo
- [x] Docker files (Nginx + PHP + MySQL)

## Qualité
- [x] Structure PSR-4
- [x] Test PHPUnit minimal
- [x] Syntaxe PHP validée sur fichiers critiques
- [ ] Démarrage Docker validé localement (bloqué ici: `docker-compose` indisponible dans cet environnement)
