# CURSOR PROMPT — TASKFLOW REDESIGN COMPLET
# Refonte UI/UX totale : la meilleure app Kanban au monde
# Backend existant : PHP 8.2 · API REST · JWT · MySQL
# Frontend à refaire intégralement : Vanilla JS · CSS pur · zéro Bootstrap

---

```
Tu es un expert en design de produit, UX engineering et développement frontend
Vanilla JS (ES2023+) avec une sensibilité design de niveau Figma senior.
Tu vas complètement refaire le frontend de TaskFlow — une application Kanban
PHP/JS existante — pour en faire une expérience utilisateur de référence,
au niveau de Linear.app et Notion, mais avec une identité visuelle propre.

Le backend PHP 8.2 + API REST + JWT + MySQL est FONCTIONNEL et ne change pas.
Tu refais uniquement tout le HTML/CSS/JS frontend, fichier par fichier.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTIVATION AGENTS CURSOR — CRÉE .cursor/rules EN PREMIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Génère ce fichier .cursor/rules avant tout code :

agents:
  design_director:
    role: "Design Director & Visual Architect"
    focus: "identité visuelle, design system, tokens, cohérence globale"
    triggers: ["design", "couleur", "typographie", "token", "visuel", "esthétique"]
    rules:
      - "Identité : dark mode profond (#0D0E14 base), accents indigo/violet (#6366F1),
         surfaces en couches (3 niveaux de profondeur : #0D0E14 / #13141C / #1C1D27)"
      - "Typographie : 'Plus Jakarta Sans' (display, poids 600-800) +
         'DM Sans' (body, poids 400-500). Importer via Google Fonts."
      - "Espacement : système 4pt (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)"
      - "Border-radius : 6px small / 10px medium / 16px large / 24px cards"
      - "Ombres : pas de box-shadow générique — ombres colorées subtiles
         (0 4px 24px rgba(99,102,241,0.12)) pour les éléments en focus"
      - "Zéro Bootstrap, Zéro Tailwind, Zéro framework CSS — CSS artisanal pur"
      - "Chaque état interactif doit être explicitement designé :
         default / hover / active / focus / disabled / loading / error"

  ux_architect:
    role: "UX Architect & Interaction Designer"
    focus: "flows utilisateur, raccourcis clavier, feedback, micro-interactions"
    triggers: ["ux", "interaction", "raccourci", "flow", "feedback", "animation"]
    rules:
      - "Toute action destructive nécessite une confirmation inline (pas de popup alert)"
      - "Feedback immédiat sur chaque action : skeleton → contenu, spinner inline"
      - "Optimistic UI : mise à jour visuelle avant réponse API + rollback si erreur"
      - "Raccourcis clavier documentés : N (nouvelle tâche), C (nouvelle colonne),
         Escape (fermer), Ctrl+Z (annuler), ? (aide raccourcis)"
      - "Drag & drop : indicateur fantôme semi-transparent + zone drop colorée"
      - "Animations : 200ms ease-out pour les transitions, 300ms pour les modals,
         spring physics pour le drag (cubic-bezier(0.34, 1.56, 0.64, 1))"
      - "Toasts de notification : coin bas-droit, empilables, auto-dismiss 3s"

  js_architect:
    role: "Vanilla JS Module Architect"
    focus: "architecture ES modules, state management, API layer, performance"
    triggers: ["javascript", "module", "state", "api", "fetch", "architecture"]
    rules:
      - "ES modules natifs : import/export, pas de bundler, importmap dans index.html"
      - "State management central : AppState singleton avec subscribe/emit pattern"
      - "API layer isolé : api.js avec fetchWithAuth(), error handling centralisé"
      - "Chaque module expose une interface minimale (init, destroy, on/off)"
      - "EventBus.js pour la communication inter-modules (CustomEvents)"
      - "Optimistic updates : clone state → update UI → appel API → rollback si erreur"
      - "Aucun console.log en production, logger conditionnel (DEV only)"

  animation_expert:
    role: "CSS Animation & Motion Specialist"
    focus: "animations CSS, transitions, drag & drop visuel, micro-interactions"
    triggers: ["animation", "transition", "motion", "drag", "hover"]
    rules:
      - "Utiliser exclusivement CSS transforms (translate, scale) — jamais left/top"
      - "will-change: transform sur les éléments draggables uniquement"
      - "Staggered animations au chargement : colonnes apparaissent 1 par 1
         avec animation-delay: calc(var(--col-index) * 60ms)"
      - "Card hover : translateY(-2px) + shadow colorée (120ms ease-out)"
      - "Column drop zone : background pulse + border dashed coloré animé"
      - "Skeleton loaders : shimmer CSS (background-position animation)"
      - "@media (prefers-reduced-motion: reduce) : désactiver toutes les animations"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIRECTION ARTISTIQUE — LIS ATTENTIVEMENT AVANT DE CODER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inspiration : Linear.app + Raycast + Vercel Dashboard
Mot clé : "Precision Dark" — sombre, dense, efficace, élégant

PALETTE COMPLÈTE (CSS custom properties dans :root) :

  /* Backgrounds — 3 niveaux de profondeur */
  --bg-void: #08090E;          /* fond le plus sombre — sidebar */
  --bg-base: #0D0E14;          /* fond principal */
  --bg-surface: #13141C;       /* cartes, colonnes */
  --bg-elevated: #1C1D27;      /* dropdowns, modals, hover */
  --bg-overlay: #252634;       /* états actifs, sélections */

  /* Accents — Indigo comme couleur signature */
  --accent-primary: #6366F1;   /* indigo — CTA principaux */
  --accent-hover: #818CF8;     /* indigo clair — hover */
  --accent-muted: #312E81;     /* indigo sombre — backgrounds accent */
  --accent-glow: rgba(99,102,241,0.15); /* halo/glow pour focus */

  /* Texte — 4 niveaux */
  --text-primary: #F1F0FF;     /* titres, labels importants */
  --text-secondary: #9B9AC8;   /* corps de texte, descriptions */
  --text-tertiary: #5C5B7A;    /* placeholders, métadonnées */
  --text-disabled: #3A3958;    /* éléments désactivés */

  /* Couleurs sémantiques */
  --color-success: #10B981;    /* vert emerald */
  --color-warning: #F59E0B;    /* amber */
  --color-danger: #EF4444;     /* rouge */
  --color-info: #3B82F6;       /* bleu */

  /* Bordures */
  --border-subtle: rgba(255,255,255,0.04);   /* très subtil */
  --border-default: rgba(255,255,255,0.08);  /* bordures normales */
  --border-strong: rgba(255,255,255,0.16);   /* hover, focus */
  --border-accent: rgba(99,102,241,0.4);     /* focus accent */

  /* Priorités des tâches — couleurs distinctes */
  --priority-urgent: #EF4444;
  --priority-high: #F97316;
  --priority-medium: #EAB308;
  --priority-low: #6B7280;

  /* Colonnes — couleurs d'accent par position */
  --col-color-1: #6366F1;  /* indigo */
  --col-color-2: #8B5CF6;  /* violet */
  --col-color-3: #06B6D4;  /* cyan */
  --col-color-4: #10B981;  /* emerald */
  --col-color-5: #F59E0B;  /* amber */

TYPOGRAPHIE :
  Titres h1-h3 : 'Plus Jakarta Sans', 700-800, letterspacing -0.02em
  Corps, labels : 'DM Sans', 400-500, letterspacing 0
  Code, IDs : 'JetBrains Mono', 400, letterspacing 0.02em
  Tailles : 11px / 12px / 13px / 14px / 16px / 20px / 24px / 32px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHITECTURE FRONTEND — LANCE LES 4 AGENTS SIMULTANÉMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Structure des fichiers à générer :

  public/
  ├── index.html                     ← Landing / redirect si connecté
  ├── login.html                     ← Page de connexion
  ├── app.html                       ← App principale (SPA shell)
  ├── assets/
  │   ├── css/
  │   │   ├── 01-reset.css           ← Modern CSS reset (Josh Comeau style)
  │   │   ├── 02-tokens.css          ← Toutes les CSS custom properties
  │   │   ├── 03-typography.css      ← Styles typographiques globaux
  │   │   ├── 04-layout.css          ← Shell de l'app (sidebar + main)
  │   │   ├── 05-sidebar.css         ← Sidebar : nav, boards, user
  │   │   ├── 06-topbar.css          ← Barre du haut : titre board + actions
  │   │   ├── 07-board.css           ← Zone Kanban principale
  │   │   ├── 08-column.css          ← Styles des colonnes
  │   │   ├── 09-card.css            ← Styles des cartes tâches
  │   │   ├── 10-modals.css          ← Modals (tâche, colonne, settings)
  │   │   ├── 11-forms.css           ← Inputs, selects, buttons, labels
  │   │   ├── 12-toasts.css          ← Notifications toast
  │   │   ├── 13-skeletons.css       ← Skeleton loaders shimmer
  │   │   ├── 14-animations.css      ← Keyframes et transitions globales
  │   │   ├── 15-drag-drop.css       ← États visuels drag & drop
  │   │   └── 16-login.css           ← Page de connexion
  │   └── js/
  │       ├── core/
  │       │   ├── api.js             ← Client API : fetchWithAuth, retry, errors
  │       │   ├── state.js           ← AppState : singleton, subscribe, emit
  │       │   ├── router.js          ← Mini-router : hash-based navigation
  │       │   ├── eventBus.js        ← CustomEvents inter-modules
  │       │   └── storage.js         ← localStorage wrapper typé
  │       ├── modules/
  │       │   ├── auth.js            ← Login, logout, refresh token JWT
  │       │   ├── boards.js          ← CRUD boards, sélection active
  │       │   ├── columns.js         ← CRUD colonnes, reorder
  │       │   ├── tasks.js           ← CRUD tâches, move between columns
  │       │   ├── dragdrop.js        ← Drag & drop HTML5 API, logique
  │       │   ├── modals.js          ← Gestionnaire de modals (ouvre/ferme)
  │       │   ├── toasts.js          ← Notifications toast empilables
  │       │   ├── shortcuts.js       ← Registry raccourcis clavier globaux
  │       │   └── search.js          ← Recherche tâches (fuzzy, live)
  │       ├── render/
  │       │   ├── board.render.js    ← Rendu HTML du board complet
  │       │   ├── column.render.js   ← Rendu HTML d'une colonne
  │       │   ├── card.render.js     ← Rendu HTML d'une carte
  │       │   └── skeleton.render.js ← Rendu des skeletons loaders
  │       └── app.js                 ← Entry point : init all modules

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[AGENT DESIGN_DIRECTOR] → LAYOUT ET COMPOSANTS VISUELS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT PRINCIPAL (app.html) — deux zones fixes :

  ┌─────────────────────────────────────────────────────┐
  │  SIDEBAR 220px fixe     │  MAIN AREA (flex-1)       │
  │  bg: --bg-void          │  bg: --bg-base            │
  │                         │  ┌─────────────────────┐  │
  │  [Logo TaskFlow]        │  │ TOPBAR 56px sticky   │  │
  │                         │  └─────────────────────┘  │
  │  ── Mes tableaux ──     │  │ BOARD SCROLL AREA    │  │
  │  ▶ Sprint 12 (actif)   │  │ colonnes côte à côte │  │
  │    Sprint 11            │  │ scroll horizontal    │  │
  │    Backlog              │  └─────────────────────┘  │
  │    + Nouveau tableau    │                            │
  │                         │                            │
  │  ── ─────────────── ── │                            │
  │  [Avatar] reda.touzani  │                            │
  │  [Déconnexion]          │                            │
  └─────────────────────────────────────────────────────┘

SIDEBAR (04-layout.css + 05-sidebar.css) :
  - Fond --bg-void avec bordure droite --border-subtle
  - Logo : "T" dans un carré gradient indigo + texte "TaskFlow"
  - Section "Mes tableaux" avec label uppercase 10px très espacé
  - Chaque board dans la liste : icône carrée colorée (couleur unique par board) +
    nom + badge count de tâches (format "12")
  - Board actif : fond --bg-elevated, bordure gauche 2px --accent-primary,
    texte --text-primary
  - Board inactif : texte --text-secondary, hover --bg-surface
  - Bouton "+ Nouveau tableau" : texte --accent-hover, pointillé subtil au hover
  - Footer sidebar : avatar initiales + nom + bouton settings discret

TOPBAR (06-topbar.css) :
  - Hauteur 56px, bg --bg-base, border-bottom --border-subtle
  - Gauche : titre du board actif (h1, 18px, 700) + badge nombre de colonnes
  - Centre : barre de recherche globale (Ctrl+K) — s'active en plein écran
  - Droite : bouton "Filtrer" + bouton "+ Colonne" (accent indigo) +
    séparateur + avatar utilisateur

COLONNES (08-column.css) :
  - Largeur fixe : 280px — jamais plus, jamais moins
  - Fond --bg-surface, border-radius 12px, border --border-subtle
  - En-tête de colonne :
    * Indicateur coloré (3px de haut, border-radius pill, couleur unique par colonne)
    * Nom de la colonne (13px, 600, --text-primary)
    * Badge count arrondi (fond --bg-elevated, 11px, --text-secondary)
    * Menu ⋯ discret (apparaît au hover de la colonne)
  - Zone de cartes : padding 8px, gap 6px entre les cartes
  - Bouton "+ Ajouter une tâche" : en bas, texte --text-tertiary, fond transparent,
    border dashed --border-default, border-radius 8px, height 36px
    → Au hover : fond --bg-elevated, texte --text-secondary, border --border-strong
  - Max-height : 100% (scroll vertical dans la colonne si trop de cartes)

CARTES (09-card.css) — le composant le plus important :
  - Fond --bg-elevated, border-radius 10px, border --border-subtle
  - Padding 12px 14px
  - Titre : 13px, 500, --text-primary, max 2 lignes avec ellipsis
  - Description (si présente) : 12px, --text-tertiary, max 1 ligne ellipsis
  - Footer de la carte (flex, space-between) :
    * Gauche : badge priorité coloré (pill, 10px, 500)
      - URGENT : fond rouge/10, texte --priority-urgent, point rouge
      - HIGH : fond orange/10, texte --priority-high
      - MEDIUM : fond jaune/10, texte --priority-medium
      - LOW : fond gris/10, texte --priority-low
    * Droite : date d'échéance (si présente, 11px, --text-tertiary) +
      avatar assigné (24px cercle, initiales, couleur générée depuis le nom)
  - Hover : translateY(-2px), border --border-strong,
    box-shadow 0 8px 24px rgba(0,0,0,0.3)
  - État dragging : opacity 0.5, scale(1.02), cursor grabbing
  - Transition : all 150ms cubic-bezier(0.4, 0, 0.2, 1)

MODAL TÂCHE (10-modals.css) — detail d'une tâche :
  - Overlay : fond rgba(0,0,0,0.7), backdrop-filter blur(4px)
  - Modale : 560px large, bg --bg-surface, border-radius 16px, border --border-default
  - Layout 2 colonnes :
    * Gauche (flex:1) : titre éditable inline, description (markdown-like),
      checklist sous-tâches, commentaires/notes
    * Droite (200px fixe) : Statut (select colonne), Priorité, Date échéance,
      Labels, Assigné
  - Titre éditable : click → input inline, pas de formulaire séparé
  - Boutons : Dupliquer, Archiver, Supprimer (rouge, avec confirmation inline)
  - Close : Escape ou clic overlay

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[AGENT UX_ARCHITECT] → FLOWS ET INTERACTIONS DÉTAILLÉES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FLOW 1 — AJOUT RAPIDE DE TÂCHE (le plus utilisé) :
  Clic "+ Ajouter une tâche" OU touche N :
  → La zone du bouton se transforme en inline form :
     [ Titre de la tâche...              ] [Créer] [✕]
  → Pas de modal — tout inline dans la colonne
  → Enter valide, Escape annule, focus auto sur l'input
  → Après création : carte apparaît avec animation slide-down
  → L'input se réinitialise pour ajouter une autre tâche immédiatement

FLOW 2 — EDITION D'UNE TÂCHE (click sur une carte) :
  → Modal slide-in depuis la droite (pas un centre-screen popup)
  → Titre : click → contenteditable inline, blur → auto-save
  → Description : textarea qui s'étend automatiquement
  → Changement de colonne : select natif custom-stylé = déplace la carte
  → Priorité : boutons icône (pas de select) — clic direct
  → Fermeture : Escape, clic overlay, ou bouton ✕
  → Auto-save sur chaque champ modifié (debounce 800ms)

FLOW 3 — DRAG & DROP :
  → Grab : curseur grabbing, carte devient ghost semi-transparent (opacity 0.4)
  → Clone : copie visuelle accrochée au curseur, légèrement plus grande (scale 1.04)
  → Drop zone : colonne cible se met en surbrillance --accent-glow,
     placeholder animé montre l'emplacement de drop
  → Release : carte s'insère avec animation spring, API appelée en background
  → Si erreur API : carte retourne à sa position originale (rollback animé)

FLOW 4 — GESTION DES COLONNES :
  → Menu ⋯ sur la colonne : Renommer / Changer couleur / Archiver / Supprimer
  → Renommer : click → titre devient input inline, Enter valide
  → Changer couleur : color picker custom (8 couleurs prédéfinies, pas de picker natif)
  → Supprimer : confirmation inline dans le menu (pas d'alert native)
     "Supprimer et déplacer les tâches vers... [select colonne]" OU "Tout supprimer"
  → Réordonner les colonnes : drag & drop horizontal (handle ⠿ au hover du header)

FLOW 5 — RECHERCHE GLOBALE (Ctrl+K) :
  → Overlay full-screen s'ouvre avec input en focus
  → Résultats en temps réel : fuzzy search sur titres + descriptions
  → Groupé par colonne (ex: "En cours (3)", "À faire (2)")
  → Flèches haut/bas pour naviguer, Enter pour ouvrir la tâche
  → Escape pour fermer

RACCOURCIS CLAVIER (shortcuts.js) :
  N          → Nouvelle tâche dans la colonne active (ou la 1ère)
  C          → Nouvelle colonne
  Ctrl+K     → Recherche globale
  Ctrl+Z     → Annuler dernière action
  ?          → Panel aide raccourcis (modale élégante)
  Escape     → Fermer modal/overlay actif
  Tab        → Focus sur la prochaine carte
  Entrée     → Ouvrir la carte en focus

TOASTS (12-toasts.css + toasts.js) :
  - Position : bas droite, 16px de marge
  - Largeur : 320px max
  - 4 types : success (vert), error (rouge), warning (amber), info (bleu)
  - Chaque toast : icône + message + bouton ✕ + barre de progression auto-dismiss
  - Auto-dismiss : 3s pour success/info, 5s pour warning, 8s pour error (pas auto)
  - Empilables : max 4 toasts visibles, les anciens poussés vers le haut

SKELETON LOADERS (13-skeletons.css) :
  - Au chargement initial : afficher 3 colonnes skeleton + 2-3 cartes par colonne
  - Shimmer animation : dégradé qui se déplace (background-position keyframe)
  - Couleur shimmer : --bg-surface → --bg-elevated → --bg-surface
  - Durée : 1.4s linear infinite
  - Disparaît colonne par colonne quand les données arrivent (staggered)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[AGENT JS_ARCHITECT] → ARCHITECTURE JAVASCRIPT COMPLÈTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

core/state.js — State Management Central :

  const AppState = {
    user: null,                  // { id, name, email }
    boards: [],                  // [ { id, name, color, columnCount } ]
    activeBoardId: null,
    columns: [],                 // [ { id, name, color, position, tasks[] } ]
    tasks: {},                   // { [columnId]: Task[] }
    ui: {
      loading: false,
      dragging: null,            // { taskId, sourceColumnId }
      activeModal: null,         // 'task' | 'column' | 'board' | 'shortcuts'
      activeTaskId: null,
      searchOpen: false,
      searchQuery: '',
    },
    history: [],                 // pour Ctrl+Z (max 20 actions)

    // Subscribe pattern
    _subscribers: new Map(),
    subscribe(key, fn) { ... },
    emit(key, data) { ... },
    set(path, value) { ... },    // setState immutable-style avec emit auto
  }

core/api.js — Client API robuste :

  const API_BASE = '/api';

  async function fetchWithAuth(endpoint, options = {}) {
    const token = storage.get('jwt_token');
    const response = await fetch(API_BASE + endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expiré → tenter refresh → sinon redirect login
      await auth.refreshToken();
      return fetchWithAuth(endpoint, options); // retry
    }

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(response.status, error.message);
    }

    return response.json();
  }

  // Toutes les opérations CRUD exposées :
  export const boardsApi = { list, get, create, update, delete }
  export const columnsApi = { list, create, update, delete, reorder }
  export const tasksApi = { list, create, update, delete, move }

modules/dragdrop.js — Drag & Drop HTML5 :

  init() :
  - Délégation d'événements sur le board container (pas sur chaque carte)
  - dragstart → stocker { taskId, sourceColumnId, sourceIndex } dans AppState
  - Créer un ghost élément avec la carte clonée, style personnalisé
  - dragover → calculer la position d'insertion dans la colonne cible
  - dragenter → highlight la colonne cible (ajouter class 'drop-target')
  - dragleave → retirer le highlight
  - drop → appeler tasks.moveTask(taskId, targetColumnId, targetIndex)
             → optimistic update immédiat
             → API call en background
             → toast succès ou rollback + toast erreur
  - dragend → nettoyer tous les états visuels

  Calcul de la position d'insertion :
  - Récupérer les cartes de la colonne cible
  - Pour chaque carte : getBoundingClientRect()
  - Comparer avec event.clientY
  - Insérer le placeholder (div.drop-placeholder) à la bonne position

modules/tasks.js — CRUD Tâches avec Optimistic Updates :

  async createTask(columnId, title) :
    1. Générer un ID temporaire (temp-uuid)
    2. Ajouter la tâche dans AppState immédiatement (optimistic)
    3. Re-render la colonne avec la nouvelle carte
    4. API POST /columns/{columnId}/tasks
    5. Remplacer l'ID temporaire par l'ID réel
    6. Toast "Tâche créée"
    7. Si erreur : retirer la tâche du state + toast erreur

  async moveTask(taskId, targetColumnId, targetIndex) :
    1. Sauvegarder { sourceColumnId, sourceIndex } pour rollback
    2. Déplacer dans AppState (splice + insert)
    3. Re-render les deux colonnes affectées
    4. API PATCH /tasks/{taskId}/move { column_id, position }
    5. Si erreur : rollback + toast erreur

  history.push({ type: 'MOVE_TASK', before, after }) pour Ctrl+Z

render/card.render.js — Rendu HTML des cartes :

  function renderCard(task) {
    return `
      <article
        class="task-card priority-${task.priority}"
        data-task-id="${task.id}"
        draggable="true"
        role="button"
        tabindex="0"
        aria-label="${task.title}"
      >
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(task.title)}</h3>
          ${task.description
            ? `<p class="card-desc">${escapeHtml(task.description)}</p>`
            : ''}
        </div>
        <footer class="card-footer">
          <span class="priority-badge priority-${task.priority}">
            <span class="priority-dot"></span>
            ${PRIORITY_LABELS[task.priority]}
          </span>
          <div class="card-meta">
            ${task.due_date
              ? `<time class="due-date ${isOverdue(task.due_date) ? 'overdue' : ''}"
                  datetime="${task.due_date}">
                  ${formatDate(task.due_date)}
                </time>`
              : ''}
          </div>
        </footer>
      </article>
    `;
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[AGENT ANIMATION_EXPERT] → ANIMATIONS ET MICRO-INTERACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14-animations.css — Keyframes et transitions :

  /* Apparition des colonnes au chargement */
  @keyframes colSlideIn {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .kanban-column {
    animation: colSlideIn 300ms ease-out both;
    animation-delay: calc(var(--col-index, 0) * 60ms);
  }

  /* Apparition d'une nouvelle carte */
  @keyframes cardSlideIn {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  .task-card.card-new {
    animation: cardSlideIn 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Shimmer skeleton */
  @keyframes shimmer {
    from { background-position: -400px 0; }
    to   { background-position:  400px 0; }
  }
  .skeleton {
    background: linear-gradient(
      90deg,
      var(--bg-surface) 25%,
      var(--bg-elevated) 50%,
      var(--bg-surface) 75%
    );
    background-size: 800px 100%;
    animation: shimmer 1.4s linear infinite;
  }

  /* Suppression d'une carte */
  @keyframes cardDelete {
    to {
      opacity: 0;
      transform: scale(0.9) translateX(20px);
      max-height: 0;
      margin: 0;
      padding: 0;
    }
  }
  .task-card.card-deleting {
    animation: cardDelete 200ms ease-in forwards;
  }

  /* Toast slide-in */
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(20px) scale(0.95); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
  }
  @keyframes toastOut {
    to   { opacity: 0; transform: translateX(24px); max-height: 0; }
  }

  /* Modal slide-in depuis la droite */
  @keyframes modalSlideIn {
    from { opacity: 0; transform: translateX(32px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* Toutes les transitions respectent prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

15-drag-drop.css — États visuels du drag :

  .task-card[draggable="true"] {
    cursor: grab;
  }
  .task-card[draggable="true"]:active {
    cursor: grabbing;
  }

  /* Carte en cours de drag */
  .task-card.is-dragging {
    opacity: 0.35;
    transform: scale(0.98);
    box-shadow: none;
    border-color: var(--border-accent);
  }

  /* Colonne cible du drop */
  .kanban-column.drop-target {
    background: color-mix(in srgb, var(--accent-primary) 6%, var(--bg-surface));
    border-color: var(--accent-primary);
    box-shadow: inset 0 0 0 1px var(--accent-primary);
  }

  /* Placeholder de position de drop */
  .drop-placeholder {
    height: 60px;
    background: var(--accent-glow);
    border: 1.5px dashed var(--accent-primary);
    border-radius: 10px;
    margin: 4px 0;
    animation: placeholderPulse 1s ease-in-out infinite;
  }
  @keyframes placeholderPulse {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1; }
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE DE LOGIN (login.html + 16-login.css)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design de la page de connexion — mémorable et distinctif :

  - Fond --bg-void avec un subtle pattern de points (CSS radial-gradient)
  - Centré verticalement, carte de login 400px large
  - Logo animé au chargement (scale 0.8 → 1 avec spring)
  - Titre : "Bon retour," + nom si localStorage, sinon "Connectez-vous."
  - Champs : email + password avec icônes SVG inline
  - Focus state : border --accent-primary + glow rgba(99,102,241,0.2)
  - Bouton "Connexion" : gradient indigo → violet, shimmer au hover
  - Erreur d'auth : message inline sous le bouton, shake animation
  - Pas de lien "Mot de passe oublié" (app interne)

  HTML structure :
  <main class="login-page">
    <div class="login-bg-pattern"></div>
    <div class="login-card">
      <div class="login-logo">...</div>
      <h1 class="login-title">Bon retour,</h1>
      <form class="login-form" id="loginForm" novalidate>
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-wrapper">
            [icône SVG email]
            <input type="email" id="email" autocomplete="email" required>
          </div>
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <div class="input-wrapper">
            [icône SVG lock]
            <input type="password" id="password" required>
            [bouton toggle visibilité]
          </div>
        </div>
        <div class="form-error" id="loginError" role="alert"></div>
        <button type="submit" class="btn-login">
          <span>Se connecter</span>
          [spinner SVG, caché par défaut]
        </button>
      </form>
    </div>
  </main>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DÉTAILS D'IMPLÉMENTATION CRITIQUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COULEURS DES COLONNES — système automatique :
  La première colonne prend --col-color-1, la deuxième --col-color-2, etc.
  Chaque colonne reçoit un attribut data-col-color="1" et une CSS var locale :
  .kanban-column { --col-accent: var(--col-color-1); }
  L'indicateur coloré, les bordures au hover et le badge count utilisent --col-accent.

GÉNÉRATION DE COULEUR D'AVATAR :
  function getAvatarColor(name) {
    const colors = ['#6366F1','#8B5CF6','#06B6D4','#10B981','#F59E0B','#EF4444'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

DATES RELATIVES :
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = date - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return `En retard de ${Math.abs(days)}j`;
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Demain";
    if (days < 7) return `Dans ${days}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

RENDU DES COLONNES — CSS variable pour le stagger :
  columns.forEach((col, index) => {
    const el = renderColumn(col);
    el.style.setProperty('--col-index', index);
    boardEl.appendChild(el);
  });

ACCESSIBILITÉ :
  - Toutes les cartes : role="button" tabindex="0", aria-label="{title}"
  - Modals : focus trap, aria-modal="true", aria-labelledby
  - Toasts : role="alert" aria-live="polite" pour success/info,
             aria-live="assertive" pour error
  - Colonnes : role="list", cartes : role="listitem"
  - Skip link : "Passer au contenu principal" (visible au focus)

SÉCURITÉ :
  - escapeHtml() sur tout contenu user avant insertion dans le DOM
  - Tokens JWT stockés en memory (sessionStorage), jamais localStorage pour auth
  - CSP headers configurés côté PHP (existant)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDRE D'IMPLÉMENTATION — GÉNÈRE DANS CET ORDRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. tokens.css (toutes les variables CSS) — le fichier le plus important
2. reset.css + typography.css
3. layout.css + sidebar.css + topbar.css
4. board.css + column.css
5. card.css (le composant le plus visible)
6. forms.css + modals.css
7. animations.css + drag-drop.css
8. toasts.css + skeletons.css
9. login.html + login.css
10. app.html (shell HTML)
11. core/api.js + core/state.js + core/eventBus.js
12. modules/auth.js + modules/boards.js
13. modules/columns.js + modules/tasks.js
14. modules/dragdrop.js (le plus complexe JS)
15. modules/modals.js + modules/toasts.js + modules/shortcuts.js
16. render/*.js (rendu HTML)
17. app.js (entry point, initialise tout)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STANDARD DE QUALITÉ — CHAQUE FICHIER DOIT RESPECTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CSS :
  ✓ Zéro valeur magique — tout en CSS custom property ou calcul explicite
  ✓ Pas de !important sauf reset
  ✓ Commentaires de section : /* ── Nom de la section ── */
  ✓ Ordre des propriétés : layout → box model → visual → typography → animation
  ✓ Chaque état interactif défini : default, hover, focus, active, disabled

JavaScript :
  ✓ JSDoc sur toutes les fonctions exportées
  ✓ Pas de var — const/let uniquement
  ✓ Async/await — pas de .then() chaînés
  ✓ Pas d'erreur silencieuse — tout error est loggé et toast affiché
  ✓ Fonctions courtes : max 25 lignes, sinon découper

HTML :
  ✓ Sémantique : article pour les cartes, nav pour la sidebar, main pour le board
  ✓ Attributs data-* pour tous les IDs (data-task-id, data-column-id)
  ✓ Pas de style inline sauf variables CSS dynamiques
  ✓ Images : alt="" pour décoratifs, alt descriptif pour les icônes importantes
```

---

> **Note d'usage** : Coller ce prompt dans Cursor Composer (Ctrl+I).
> Cursor va détecter les agents dans .cursor/rules et les activer.
> Lancer en mode "Apply to all files" pour générer toute l'architecture d'un coup.
> Le backend PHP existant n'est pas touché — seul le dossier public/ est regénéré.
