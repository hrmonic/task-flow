# TaskFlow — refonte « Precision Dark » (sans Bootstrap)

## Vision

Interface Kanban dense, sombre et précise (référence : Linear / Raycast), identité indigo/violet, navigation par sidebar pour les tableaux, feedback chargement (skeleton), raccourcis clavier et UI optimiste là où c’est pertinent.

## Références internes

- Mock avant / après : [taskflow_before_after.html](taskflow_before_after.html)
- Spécification détaillée (architecture cible, états, motion) : [prompt-taskflow-redesign.md](prompt-taskflow-redesign.md)

## Contraintes techniques

- **Backend** : PHP 8.2, API REST, JWT — stable ; évolutions API seulement si nécessaire (ex. champs déjà exposés).
- **CSP** : `style-src 'self' 'unsafe-inline'` — **polices auto-hébergées** sous `public/assets/fonts/`, pas de Google Fonts en CDN navigateur.
- **Pas de Bootstrap** : layout, formulaires et boutons en CSS / JS vanilla avec préfixe de classes `tf-` où utile.

## Définition de « terminé » par lot

| Lot | Critères |
|-----|-----------|
| Design tokens + shell | Couleurs Precision Dark, typo Plus Jakarta / DM Sans locales, boutons/champs/cartes cohérents |
| Shell app | Header responsive sans `bootstrap.bundle`, skip link, zones main/footer |
| Tableaux + Kanban | Toolbar utilisable, cartes priorité + échéance relative si `due_date` présent |
| Premium UX | Liste sidebar des tableaux, raccourcis (N, C, ?, Escape, Ctrl+K, Ctrl+Z ciblé), skeleton au chargement, optimistic + rollback |
| Qualité | Tests PHPUnit OK, reduced-motion, focus visible, dialogues piégés |

## Phases (ordre de livraison)

1. Documentation + règle Cursor `task-flow/**`
2. Fondations CSS + polices
3. `app.php` + menu mobile vanilla
4. `app.js` (auth, dashboard, sidebar boards, raccourcis)
5. `kanban.js` + styles + modales `.tf-*`
6. Suppression vendor Bootstrap + README
7. Skeleton, optimistic, undo, a11y, tests
