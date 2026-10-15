<p align="center"><img src="docs/assets/project-hero.svg" alt="TaskFlow — tableau Kanban fullstack avec authentification, tâches et déploiement Docker" width="100%"></p>

<h1 align="center">TaskFlow</h1>

<p align="center"><strong>Une application Kanban fullstack en PHP 8.2, MySQL et JavaScript natif, avec espaces de travail authentifiés et déplacement des tâches.</strong></p>

<p align="center"><a href="README.md">Read in English</a> · <a href="#overview">Présentation</a> · <a href="#features">Fonctionnalités</a> · <a href="#architecture">Architecture</a> · <a href="#start">Démarrer</a> · <a href="#quality">Qualité</a> · <a href="#faq">FAQ</a> · <a href="#license">Licence</a></p>

<p align="center"> <img alt="Stack" src="https://img.shields.io/badge/stack-PHP%20%2F%20MySQL-475569"></p>

<a id="overview"></a>
## Présentation

TaskFlow est une application Kanban auto-hébergeable qui organise le travail en tableaux, colonnes et tâches. Le projet présente un parcours de développement fullstack : interactions navigateur, API REST, authentification, persistance relationnelle et orchestration de conteneurs. Il s'agit d'un outil de suivi ciblé, pas d'un substitut à une suite complète de gestion de projet.

**Public concerné :** Développeurs, petites équipes projet et recruteurs souhaitant examiner un workflow métier développé de bout en bout.

**Exemple :** un utilisateur s'inscrit, crée un tableau, définit les colonnes, ajoute des tâches puis les déplace par glisser-déposer. Les modifications sont enregistrées via l'API PHP.

<a id="features"></a>
## Fonctionnalités

| Fonction | Description |
| --- | --- |
| **Tableaux et colonnes** | Création, renommage, réordonnancement et suppression. |
| **Gestion des tâches** | Ajout, modification, déplacement et suppression. |
| **Authentification** | Inscription, connexion et renouvellement des sessions. |
| **Contrôles de propriété** | Vérifications d'accès aux ressources de l'utilisateur côté API. |
| **Glisser-déposer** | Déplacement des tâches enregistré via des endpoints dédiés. |
| **Déploiement local** | Services Nginx, PHP et MySQL déclarés dans Docker Compose. |

<a id="architecture"></a>
## Architecture technique

L'application sépare l'interface dans public/, le code PHP dans src/, les migrations et fixtures dans database/ et la configuration des conteneurs dans docker/. L'API expose l'authentification, les tableaux, les colonnes et les tâches. Le frontend utilise JavaScript et CSS natifs.

**Stack :** PHP 8.2, PDO, MySQL 8, Nginx, JavaScript natif, Docker Compose et PHPUnit. Les routes protégées utilisent des jetons JWT et des mécanismes de renouvellement ; le dépôt documente également le hachage des mots de passe et des validations.

<a id="start"></a>
## Installation et lancement

**Prérequis :** Docker Compose et PHP/Composer pour le démarrage local documenté. Copier .env.example vers .env avant de lancer les conteneurs. Les valeurs fournies sont destinées au développement.

```bash
git clone https://github.com/hrmonic/task-flow.git
cd task-flow
cp .env.example .env
composer install
docker compose up -d --build
docker exec taskflow-php php database/migrate.php
docker exec taskflow-php php database/seed.php
```

Ouvrir http://localhost:8080 après le démarrage des services. Sous Windows, copier manuellement le fichier d'environnement si nécessaire. Le serveur PHP intégré reste possible pour l'interface, à condition de disposer aussi d'une base MySQL.

<a id="quality"></a>
## Qualité, sécurité et limites

Le dépôt documente Argon2id pour les mots de passe, des requêtes SQL préparées, JWT, contrôles de propriété, jetons CSRF, configuration CORS et en-têtes de sécurité. Quelques tests PHPUnit ciblés existent ; aucune CI GitHub Actions n'a été détectée.

### Limites et précautions

- Les identifiants de développement du fichier .env et de Compose doivent être renforcés avant toute exposition publique.
- Les protections déclarées ne remplacent pas un audit de sécurité de production.
- Aucun fichier LICENSE n'est actuellement publié, donc les autorisations de réutilisation ne sont pas explicites.
- Le périmètre couvre le Kanban, pas la gestion complète d'un portefeuille agile.

### Améliorations possibles

- Choisir et publier une licence explicite.
- Étendre les tests API/métier et ajouter une CI.
- Ajouter des captures authentiques et un parcours utilisateur filmé.
- Valider l'intérêt de fonctions de reporting avant leur développement.

### Documentation complémentaire

- [Checklist du projet](CHECKLIST.md)
- [Spécification initiale](projet.md)

<a id="faq"></a>
## Questions fréquentes

### Que peut-on gérer avec TaskFlow ?

Des tableaux, des colonnes configurables et des tâches déplacées dans un workflow.

### Docker est-il obligatoire ?

L'installation complète documentée utilise Docker Compose, mais un développement manuel de la pile reste possible.

### Où sont enregistrées les tâches ?

En base MySQL, via le backend PHP.

### L'application est-elle prête pour un hébergement public ?

Un durcissement et un examen indépendant de sécurité restent nécessaires.

<a id="license"></a>
## Licence et auteur

**Aucun fichier de licence n'est actuellement présent.** La publication du code ne constitue pas une autorisation de le copier, modifier ou redistribuer. Une licence explicite pourra être ajoutée avant une ouverture à la contribution externe.

**Auteur :** [Réda Touzani (@hrmonic)](https://github.com/hrmonic).

---

*Une étude de cas Kanban fullstack centrée sur la réalisation, la traçabilité et la compréhension des workflows.*
