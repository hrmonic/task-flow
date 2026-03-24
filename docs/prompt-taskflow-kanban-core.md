# CURSOR PROMPT — TASKFLOW KANBAN CORE REDESIGN
# Focus unique : le board Kanban — layout, couleurs, viewport, UX
# Ne touche PAS au backend PHP, NE touche PAS aux autres pages
# Objectif : corriger le layout horizontal + design moderne des colonnes/cartes

---

```
Tu es un expert CSS senior spécialisé en interfaces Kanban (Linear, Notion,
Trello niveau enterprise). Tu vas corriger et refaire entièrement le composant
Kanban de TaskFlow — uniquement les fichiers CSS et JS qui concernent le board,
les colonnes et les cartes.

PROBLÈME ACTUEL À CORRIGER EN PRIORITÉ :
Les colonnes s'empilent verticalement au lieu de s'aligner horizontalement.
Cause probable : le conteneur de colonnes n'a pas de display flex/grid horizontal,
ou les colonnes ont un width: 100% / display: block par défaut.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTIVATION AGENTS CURSOR — CRÉE .cursor/rules EN PREMIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# .cursor/rules
agents:
  layout_surgeon:
    role: "CSS Layout Specialist"
    focus: "corriger le layout horizontal, overflow, scroll, viewport"
    triggers: ["layout", "colonne", "flex", "grid", "scroll", "viewport", "width"]
    rules:
      - "Le conteneur board = display:flex, flex-direction:row, JAMAIS column"
      - "Chaque colonne = flex-shrink:0, width:300px fixe — jamais flex:1 ni 100%"
      - "overflow-x:auto sur le board + overflow-y:hidden pour éviter double scroll"
      - "Le board prend 100vw moins la largeur de la sidebar (var(--sidebar-w, 0px))"
      - "height: 100% sur toute la chaîne parent → board → colonnes"
      - "Colonnes : overflow-y:auto pour le scroll vertical des cartes"
      - "Pas de max-width sur le conteneur board — il doit s'étirer infiniment"

  column_designer:
    role: "Column UI/UX Designer"
    focus: "design des colonnes, couleurs, header, zones de drop"
    triggers: ["colonne", "couleur", "header", "design", "color picker"]
    rules:
      - "Chaque colonne a une couleur signature choisie par l'utilisateur"
      - "La couleur s'exprime sur : barre top 3px + header badge count + borders au hover"
      - "Color picker : 12 couleurs prédéfinies en grille, pas de picker natif browser"
      - "La colonne elle-même reste neutre (sombre) — seuls les accents sont colorés"
      - "Header sticky dans la colonne : reste visible quand on scrolle les cartes"

  card_designer:
    role: "Card Component Specialist"
    focus: "design des cartes, priorités, métadonnées, états visuels"
    triggers: ["carte", "card", "priorité", "tâche", "hover", "drag"]
    rules:
      - "Carte = fond légèrement surélevé, bords arrondis, padding généreux"
      - "Indicateur priorité : bande colorée gauche 3px OU badge pill"
      - "États : default / hover (lift) / dragging (ghost) / selected"
      - "Toutes les métadonnées sur une ligne footer : priorité + date + count"

  viewport_expert:
    role: "Full Viewport Experience Architect"
    focus: "utilisation maximale du viewport, pas de scroll inutile, hauteur"
    triggers: ["viewport", "100vw", "hauteur", "scroll", "fullscreen"]
    rules:
      - "html, body : height:100%, overflow:hidden — on contrôle NOUS le scroll"
      - "L'app shell : height:100vh, display:flex — sidebar + main côte à côte"
      - "Le main : flex:1, min-width:0, display:flex, flex-direction:column"
      - "Le board : flex:1, overflow hidden sur l'axe vertical"
      - "Scroll horizontal UNIQUEMENT sur la zone des colonnes"
      - "Scrollbar custom : fine, colorée, sans prendre de place visuelle"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIERS À GÉNÉRER / MODIFIER — DANS CET ORDRE EXACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. tokens.css          — variables CSS pour le board
2. board-layout.css    — fix critique du layout horizontal
3. column.css          — design complet des colonnes
4. card.css            — design complet des cartes
5. color-picker.css    — color picker custom
6. board.js            — fix JS du rendu des colonnes
7. color-picker.js     — logique du sélecteur de couleur

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER 1 — tokens.css
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Génère ce fichier complet :

:root {
  /* ── Sidebar ── */
  --sidebar-w: 220px;

  /* ── Backgrounds ── */
  --bg-app:      #0B0C11;
  --bg-board:    #0F1117;
  --bg-column:   #161820;
  --bg-card:     #1E2030;
  --bg-card-hov: #252840;
  --bg-elevated: #2A2D42;
  --bg-input:    #1A1C28;

  /* ── Texte ── */
  --tx-primary:   #EEEEFF;
  --tx-secondary: #8B8DB8;
  --tx-muted:     #4A4C6A;
  --tx-placeholder: #3A3C55;

  /* ── Bordures ── */
  --bd-subtle:  rgba(255,255,255,0.05);
  --bd-default: rgba(255,255,255,0.09);
  --bd-hover:   rgba(255,255,255,0.18);

  /* ── Accent app ── */
  --accent:      #6366F1;
  --accent-soft: rgba(99,102,241,0.15);

  /* ── Couleurs colonnes (12 choix utilisateur) ── */
  --col-indigo:  #6366F1;
  --col-violet:  #8B5CF6;
  --col-pink:    #EC4899;
  --col-rose:    #F43F5E;
  --col-orange:  #F97316;
  --col-amber:   #F59E0B;
  --col-yellow:  #EAB308;
  --col-lime:    #84CC16;
  --col-emerald: #10B981;
  --col-cyan:    #06B6D4;
  --col-sky:     #3B82F6;
  --col-slate:   #64748B;

  /* ── Priorités ── */
  --p-urgent: #EF4444;
  --p-high:   #F97316;
  --p-medium: #EAB308;
  --p-low:    #64748B;
  --p-none:   #3A3C55;

  /* ── Dimensions ── */
  --col-w:          300px;
  --col-gap:        12px;
  --col-padding:    12px;
  --col-header-h:   48px;
  --card-radius:    10px;
  --col-radius:     12px;
  --board-padding:  20px;

  /* ── Transitions ── */
  --t-fast:   120ms ease-out;
  --t-normal: 200ms ease-out;
  --t-spring: 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER 2 — board-layout.css  ← LE PLUS CRITIQUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ce fichier corrige LE bug principal. Génère chaque règle avec un commentaire.

/* ── Reset global pour contrôler la hauteur ── */
html,
body {
  height: 100%;
  overflow: hidden;  /* On gère le scroll nous-mêmes */
  margin: 0;
  padding: 0;
}

/* ── Shell de l'application ── */
.app-shell {
  display: flex;
  flex-direction: row;   /* sidebar gauche + main droite */
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--bg-app);
}

/* ── Zone principale (tout sauf sidebar) ── */
.app-main {
  flex: 1;
  min-width: 0;           /* CRITIQUE : empêche flex item de déborder */
  display: flex;
  flex-direction: column; /* topbar en haut + board en bas */
  height: 100vh;
  overflow: hidden;
}

/* ── Topbar ── */
.board-topbar {
  flex-shrink: 0;         /* Ne rétrécit jamais */
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 var(--board-padding);
  background: var(--bg-app);
  border-bottom: 1px solid var(--bd-subtle);
  gap: 12px;
  z-index: 10;
}

/* ── Zone de scroll horizontal du board ── */
/* C'est ici que tout se joue — ce conteneur fait défiler les colonnes */
.board-scroll-area {
  flex: 1;               /* Prend tout l'espace vertical restant */
  display: flex;
  flex-direction: row;   /* ← COLONNES CÔTE À CÔTE — règle fondamentale */
  align-items: flex-start;
  gap: var(--col-gap);
  padding: var(--board-padding);
  overflow-x: auto;      /* Scroll horizontal pour les colonnes */
  overflow-y: hidden;    /* PAS de scroll vertical ici */
  min-height: 0;

  /* Scrollbar fine et discrète */
  scrollbar-width: thin;
  scrollbar-color: var(--bd-hover) transparent;
}

.board-scroll-area::-webkit-scrollbar {
  height: 6px;
}
.board-scroll-area::-webkit-scrollbar-track {
  background: transparent;
}
.board-scroll-area::-webkit-scrollbar-thumb {
  background: var(--bd-hover);
  border-radius: 99px;
}
.board-scroll-area::-webkit-scrollbar-thumb:hover {
  background: var(--tx-muted);
}

/* ── Chaque colonne — NE PAS MODIFIER CES 3 RÈGLES ── */
.kanban-column {
  flex-shrink: 0;        /* ← CRITIQUE : la colonne ne rétrécit JAMAIS */
  width: var(--col-w);  /* ← CRITIQUE : largeur fixe, pas de % */
  min-width: var(--col-w);
  /* Le reste du style est dans column.css */
}

/* ── Bouton ajout de colonne — toujours en dernier ── */
.btn-add-column {
  flex-shrink: 0;
  width: 260px;
  align-self: flex-start; /* Ne s'étire pas en hauteur */
}

/* ── Si l'app n'a pas de sidebar (page pleine largeur) ── */
.no-sidebar .app-main {
  width: 100vw;
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER 3 — column.css
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/* ── Structure de la colonne ── */
.kanban-column {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 56px - (var(--board-padding) * 2));
  max-height: calc(100vh - 56px - (var(--board-padding) * 2));
  background: var(--bg-column);
  border-radius: var(--col-radius);
  border: 1px solid var(--bd-subtle);

  /* La couleur de la colonne est portée par --col-accent
     définie dynamiquement via JS : el.style.setProperty('--col-accent', color) */
  --col-accent: var(--col-indigo); /* valeur par défaut */

  transition: border-color var(--t-normal);
}

.kanban-column:hover {
  border-color: var(--bd-default);
}

/* ── Barre de couleur en haut de la colonne ── */
.kanban-column::before {
  content: '';
  display: block;
  height: 3px;
  background: var(--col-accent);
  border-radius: var(--col-radius) var(--col-radius) 0 0;
  flex-shrink: 0;
  opacity: 0.9;
  transition: opacity var(--t-normal);
}

.kanban-column:hover::before {
  opacity: 1;
}

/* ── Header de la colonne ── */
.column-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px var(--col-padding) 8px;
  height: var(--col-header-h);
  flex-shrink: 0;
  position: sticky;   /* Reste visible quand on scrolle les cartes */
  top: 0;
  z-index: 2;
  background: var(--bg-column);
  border-bottom: 1px solid var(--bd-subtle);
}

/* Pastille couleur cliquable (ouvre le color picker) */
.column-color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--col-accent);
  flex-shrink: 0;
  cursor: pointer;
  border: 1.5px solid rgba(255,255,255,0.15);
  transition: transform var(--t-spring), border-color var(--t-fast);
}

.column-color-dot:hover {
  transform: scale(1.3);
  border-color: rgba(255,255,255,0.4);
}

/* Nom de la colonne */
.column-title {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: var(--tx-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
  letter-spacing: -0.01em;
}

/* Édition inline du titre */
.column-title-input {
  flex: 1;
  background: var(--bg-input);
  border: 1px solid var(--col-accent);
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--tx-primary);
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--col-accent) 20%, transparent);
}

/* Badge compteur de tâches */
.column-count {
  font-size: 11px;
  font-weight: 500;
  color: var(--col-accent);
  background: color-mix(in srgb, var(--col-accent) 15%, transparent);
  padding: 2px 7px;
  border-radius: 99px;
  flex-shrink: 0;
  min-width: 22px;
  text-align: center;
  border: 1px solid color-mix(in srgb, var(--col-accent) 30%, transparent);
}

/* Menu ⋯ actions de la colonne */
.column-menu-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--tx-muted);
  cursor: pointer;
  opacity: 0;           /* Caché par défaut, visible au hover de la colonne */
  transition: opacity var(--t-fast), background var(--t-fast), color var(--t-fast);
  flex-shrink: 0;
}

.kanban-column:hover .column-menu-btn {
  opacity: 1;
}

.column-menu-btn:hover {
  background: var(--bg-elevated);
  color: var(--tx-primary);
}

/* ── Zone de défilement des cartes ── */
.column-cards {
  flex: 1;
  overflow-y: auto;     /* Scroll vertical des cartes dans la colonne */
  overflow-x: hidden;
  padding: var(--col-padding);
  display: flex;
  flex-direction: column;
  gap: 6px;

  scrollbar-width: thin;
  scrollbar-color: var(--bd-default) transparent;
}

.column-cards::-webkit-scrollbar {
  width: 4px;
}
.column-cards::-webkit-scrollbar-thumb {
  background: var(--bd-default);
  border-radius: 99px;
}

/* ── Footer de la colonne : bouton ajout ── */
.column-footer {
  padding: 8px var(--col-padding) var(--col-padding);
  flex-shrink: 0;
}

.btn-add-task {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px dashed var(--bd-default);
  background: transparent;
  color: var(--tx-muted);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--t-normal);
  text-align: left;
}

.btn-add-task:hover {
  background: color-mix(in srgb, var(--col-accent) 8%, transparent);
  border-color: color-mix(in srgb, var(--col-accent) 40%, transparent);
  color: var(--col-accent);
}

.btn-add-task svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* ── Inline form d'ajout rapide ── */
.task-quick-add {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.task-quick-add input {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--col-accent);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
  color: var(--tx-primary);
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--col-accent) 15%, transparent);
  box-sizing: border-box;
}

.task-quick-add-actions {
  display: flex;
  gap: 6px;
}

.btn-quick-create {
  flex: 1;
  padding: 6px;
  background: var(--col-accent);
  border: none;
  border-radius: 7px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity var(--t-fast);
}

.btn-quick-create:hover {
  opacity: 0.85;
}

.btn-quick-cancel {
  padding: 6px 10px;
  background: transparent;
  border: 1px solid var(--bd-default);
  border-radius: 7px;
  color: var(--tx-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all var(--t-fast);
}

.btn-quick-cancel:hover {
  background: var(--bg-elevated);
  color: var(--tx-primary);
}

/* ── État drag-over (colonne cible) ── */
.kanban-column.drag-over {
  border-color: var(--col-accent);
  background: color-mix(in srgb, var(--col-accent) 5%, var(--bg-column));
}

.kanban-column.drag-over::before {
  opacity: 1;
  height: 4px;
}

/* ── Bouton Nouvelle colonne ── */
.btn-add-column {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  height: 44px;
  background: transparent;
  border: 1.5px dashed var(--bd-default);
  border-radius: var(--col-radius);
  color: var(--tx-muted);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--t-normal);
  white-space: nowrap;
}

.btn-add-column:hover {
  background: var(--bg-column);
  border-color: var(--accent);
  color: var(--accent);
}

/* ── Animations ── */
@keyframes colAppear {
  from { opacity: 0; transform: translateX(16px); }
  to   { opacity: 1; transform: translateX(0); }
}

.kanban-column {
  animation: colAppear 250ms ease-out both;
  animation-delay: calc(var(--col-index, 0) * 50ms);
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER 4 — card.css
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/* ── Carte de base ── */
.task-card {
  background: var(--bg-card);
  border-radius: var(--card-radius);
  border: 1px solid var(--bd-subtle);
  padding: 10px 12px;
  cursor: pointer;
  transition: transform var(--t-normal),
              border-color var(--t-normal),
              background var(--t-normal),
              box-shadow var(--t-normal);
  position: relative;
  overflow: hidden;

  /* Bande de priorité gauche */
  border-left: 3px solid var(--priority-color, var(--p-none));
}

/* Priorités — couleur de la bande gauche */
.task-card[data-priority="urgent"] { --priority-color: var(--p-urgent); }
.task-card[data-priority="high"]   { --priority-color: var(--p-high);   }
.task-card[data-priority="medium"] { --priority-color: var(--p-medium); }
.task-card[data-priority="low"]    { --priority-color: var(--p-low);    }
.task-card[data-priority="none"]   { --priority-color: var(--p-none);   }

/* ── Hover ── */
.task-card:hover {
  background: var(--bg-card-hov);
  border-color: var(--bd-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.35);
}

/* ── Titre ── */
.card-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--tx-primary);
  line-height: 1.45;
  margin: 0 0 6px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

/* ── Description (optionnelle) ── */
.card-desc {
  font-size: 11.5px;
  color: var(--tx-secondary);
  line-height: 1.5;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

/* ── Footer de la carte ── */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-top: 8px;
}

/* ── Badge priorité ── */
.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 99px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  flex-shrink: 0;
}

.priority-badge::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

.priority-badge.urgent {
  color: var(--p-urgent);
  background: color-mix(in srgb, var(--p-urgent) 14%, transparent);
}
.priority-badge.high {
  color: var(--p-high);
  background: color-mix(in srgb, var(--p-high) 14%, transparent);
}
.priority-badge.medium {
  color: var(--p-medium);
  background: color-mix(in srgb, var(--p-medium) 14%, transparent);
}
.priority-badge.low {
  color: var(--p-low);
  background: color-mix(in srgb, var(--p-low) 14%, transparent);
}

/* ── Date d'échéance ── */
.card-due-date {
  font-size: 10.5px;
  color: var(--tx-muted);
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
}

.card-due-date svg {
  width: 10px;
  height: 10px;
}

.card-due-date.overdue {
  color: var(--p-urgent);
}

.card-due-date.due-soon {
  color: var(--p-medium);
}

/* ── Drag states ── */
.task-card[draggable="true"] {
  cursor: grab;
}

.task-card.is-dragging {
  opacity: 0.3;
  transform: scale(0.97);
  box-shadow: none;
}

/* Placeholder zone de drop */
.drop-placeholder {
  height: 56px;
  border-radius: var(--card-radius);
  border: 1.5px dashed var(--accent);
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  flex-shrink: 0;

  animation: placeholderPulse 900ms ease-in-out infinite;
}

@keyframes placeholderPulse {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 1; }
}

/* ── Apparition d'une nouvelle carte ── */
@keyframes cardSlideDown {
  from { opacity: 0; transform: translateY(-10px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.task-card.card-new {
  animation: cardSlideDown 220ms var(--t-spring);
}

/* ── Suppression d'une carte ── */
@keyframes cardFadeOut {
  to {
    opacity: 0;
    transform: scale(0.92) translateX(12px);
    max-height: 0;
    margin: 0;
    padding: 0;
    border-width: 0;
  }
}

.task-card.card-removing {
  animation: cardFadeOut 180ms ease-in forwards;
  overflow: hidden;
}

/* ── Respect des préférences de mouvement ── */
@media (prefers-reduced-motion: reduce) {
  .task-card,
  .kanban-column,
  .drop-placeholder {
    animation: none !important;
    transition: background var(--t-fast), border-color var(--t-fast) !important;
    transform: none !important;
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER 5 — color-picker.css
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/* ── Dropdown color picker ── */
.color-picker-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 100;
  background: var(--bg-elevated);
  border: 1px solid var(--bd-hover);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.6);
  width: 188px;

  /* Animation d'ouverture */
  animation: pickerOpen 150ms ease-out both;
}

@keyframes pickerOpen {
  from { opacity: 0; transform: translateY(-4px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* Label du picker */
.color-picker-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--tx-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
  display: block;
}

/* Grille des 12 couleurs */
.color-picker-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
}

/* Chaque swatch */
.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform var(--t-spring), border-color var(--t-fast);
  position: relative;
}

.color-swatch:hover {
  transform: scale(1.2);
}

/* Swatch actif — check visible */
.color-swatch.active {
  border-color: rgba(255,255,255,0.9);
  transform: scale(1.15);
}

.color-swatch.active::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2 6l3 3 5-5' stroke='white' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/10px no-repeat;
}

/* Les 12 couleurs */
.color-swatch[data-color="indigo"]  { background: var(--col-indigo); }
.color-swatch[data-color="violet"]  { background: var(--col-violet); }
.color-swatch[data-color="pink"]    { background: var(--col-pink); }
.color-swatch[data-color="rose"]    { background: var(--col-rose); }
.color-swatch[data-color="orange"]  { background: var(--col-orange); }
.color-swatch[data-color="amber"]   { background: var(--col-amber); }
.color-swatch[data-color="yellow"]  { background: var(--col-yellow); }
.color-swatch[data-color="lime"]    { background: var(--col-lime); }
.color-swatch[data-color="emerald"] { background: var(--col-emerald); }
.color-swatch[data-color="cyan"]    { background: var(--col-cyan); }
.color-swatch[data-color="sky"]     { background: var(--col-sky); }
.color-swatch[data-color="slate"]   { background: var(--col-slate); }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER 6 — board.js  (rendu des colonnes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Génère le HTML d'une colonne Kanban.
 * IMPORTANT : la colonne est un article flex column dans un conteneur flex row.
 *
 * @param {Object} column  - { id, name, color, tasks[] }
 * @param {number} index   - position de la colonne (pour le stagger CSS)
 * @returns {HTMLElement}
 */
function renderColumn(column, index) {
  const colorValue = COLOR_MAP[column.color] || COLOR_MAP['indigo'];

  const el = document.createElement('article');
  el.className = 'kanban-column';
  el.dataset.columnId = column.id;
  el.style.setProperty('--col-accent', colorValue);
  el.style.setProperty('--col-index', index);

  el.innerHTML = `
    <header class="column-header">
      <button
        class="column-color-dot"
        aria-label="Changer la couleur de la colonne"
        data-column-id="${column.id}"
        title="Changer la couleur"
      ></button>

      <h2 class="column-title" data-editable="column-name">${escapeHtml(column.name)}</h2>

      <span class="column-count" aria-label="${column.tasks.length} tâches">
        ${column.tasks.length}
      </span>

      <button class="column-menu-btn" aria-label="Options de la colonne">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.2"/>
          <circle cx="8" cy="8" r="1.2"/>
          <circle cx="8" cy="13" r="1.2"/>
        </svg>
      </button>
    </header>

    <div class="column-cards" role="list" aria-label="Tâches de ${escapeHtml(column.name)}">
      ${column.tasks.map(task => renderCard(task)).join('')}
    </div>

    <footer class="column-footer">
      <button class="btn-add-task" data-column-id="${column.id}">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3v10M3 8h10" stroke-linecap="round"/>
        </svg>
        Ajouter une tâche
      </button>
    </footer>
  `;

  return el;
}

/**
 * Génère le HTML d'une carte.
 *
 * @param {Object} task - { id, title, description, priority, due_date }
 * @returns {string} HTML string
 */
function renderCard(task) {
  const priorityLabel = {
    urgent: 'Urgent', high: 'Haute',
    medium: 'Moyenne', low: 'Basse', none: ''
  }[task.priority || 'none'];

  const dueDateHtml = task.due_date ? `
    <span class="card-due-date ${getDueDateClass(task.due_date)}">
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="1" y="2" width="10" height="9" rx="1.5"/>
        <path d="M4 1v2M8 1v2M1 5h10" stroke-linecap="round"/>
      </svg>
      ${formatRelativeDate(task.due_date)}
    </span>` : '';

  return `
    <article
      class="task-card"
      role="listitem"
      data-task-id="${task.id}"
      data-priority="${task.priority || 'none'}"
      draggable="true"
      tabindex="0"
      aria-label="${escapeHtml(task.title)}"
    >
      <h3 class="card-title">${escapeHtml(task.title)}</h3>
      ${task.description
        ? `<p class="card-desc">${escapeHtml(task.description)}</p>`
        : ''}
      <footer class="card-footer">
        ${priorityLabel
          ? `<span class="priority-badge ${task.priority}">${priorityLabel}</span>`
          : '<span></span>'}
        ${dueDateHtml}
      </footer>
    </article>
  `;
}

/**
 * Rend toutes les colonnes dans le board.
 * UTILISE insertAdjacentElement pour ajouter AVANT le bouton "+ Colonne"
 *
 * @param {Array}       columns        - tableau des colonnes
 * @param {HTMLElement} boardContainer - .board-scroll-area
 */
function renderBoard(columns, boardContainer) {
  // Vider les colonnes existantes (PAS le bouton add-column)
  boardContainer
    .querySelectorAll('.kanban-column')
    .forEach(el => el.remove());

  const addColBtn = boardContainer.querySelector('.btn-add-column');

  columns.forEach((column, index) => {
    const colEl = renderColumn(column, index);
    // Insérer AVANT le bouton — les colonnes restent à gauche du bouton
    if (addColBtn) {
      boardContainer.insertBefore(colEl, addColBtn);
    } else {
      boardContainer.appendChild(colEl);
    }
  });
}

/**
 * Ajoute UNE nouvelle colonne sans tout re-rendre.
 * Appelé après POST /api/columns
 */
function appendColumn(column, boardContainer) {
  const index = boardContainer.querySelectorAll('.kanban-column').length;
  const colEl = renderColumn(column, index);
  colEl.classList.add('card-new'); // trigger animation

  const addColBtn = boardContainer.querySelector('.btn-add-column');
  if (addColBtn) {
    boardContainer.insertBefore(colEl, addColBtn);
  } else {
    boardContainer.appendChild(colEl);
  }

  // Scroll jusqu'à la nouvelle colonne
  colEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
}

/* Map couleur → valeur CSS */
const COLOR_MAP = {
  indigo:  'var(--col-indigo)',
  violet:  'var(--col-violet)',
  pink:    'var(--col-pink)',
  rose:    'var(--col-rose)',
  orange:  'var(--col-orange)',
  amber:   'var(--col-amber)',
  yellow:  'var(--col-yellow)',
  lime:    'var(--col-lime)',
  emerald: 'var(--col-emerald)',
  cyan:    'var(--col-cyan)',
  sky:     'var(--col-sky)',
  slate:   'var(--col-slate)',
};

/* Format date relative */
function formatRelativeDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const days = Math.ceil((date - now) / 86400000);
  if (days < -1) return `${Math.abs(days)}j de retard`;
  if (days === -1 || days === 0) return "Aujourd'hui";
  if (days === 1) return 'Demain';
  if (days < 8) return `Dans ${days}j`;
  return date.toLocaleDateString('fr-FR', { day:'numeric', month:'short' });
}

function getDueDateClass(dateStr) {
  const days = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  if (days < 0) return 'overdue';
  if (days <= 2) return 'due-soon';
  return '';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER 7 — color-picker.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Color picker inline pour les colonnes.
 * S'ouvre au clic sur la pastille .column-color-dot
 * Se ferme au clic dehors ou sur un swatch
 */

const COLORS = [
  'indigo','violet','pink','rose',
  'orange','amber','yellow','lime',
  'emerald','cyan','sky','slate'
];

let activePicker = null; // référence au picker ouvert

/**
 * Initialise la délégation d'événements pour le color picker.
 * À appeler une seule fois au démarrage.
 */
function initColorPicker(boardContainer) {
  // Ouvrir au clic sur la pastille
  boardContainer.addEventListener('click', (e) => {
    const dot = e.target.closest('.column-color-dot');
    if (!dot) return;
    e.stopPropagation();

    const columnId = dot.dataset.columnId;
    const column = dot.closest('.kanban-column');
    const currentColor = column.dataset.color || 'indigo';

    togglePicker(dot, columnId, currentColor);
  });

  // Fermer au clic en dehors
  document.addEventListener('click', (e) => {
    if (activePicker && !activePicker.contains(e.target)) {
      closePicker();
    }
  });

  // Fermer à l'Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activePicker) closePicker();
  });
}

/**
 * Ouvre ou ferme le picker pour une colonne.
 */
function togglePicker(anchorEl, columnId, currentColor) {
  if (activePicker) {
    closePicker();
    return;
  }

  const picker = document.createElement('div');
  picker.className = 'color-picker-dropdown';
  picker.setAttribute('role', 'dialog');
  picker.setAttribute('aria-label', 'Choisir une couleur');
  picker.innerHTML = `
    <span class="color-picker-label">Couleur de la colonne</span>
    <div class="color-picker-grid" role="radiogroup">
      ${COLORS.map(color => `
        <button
          class="color-swatch ${color === currentColor ? 'active' : ''}"
          data-color="${color}"
          data-column-id="${columnId}"
          role="radio"
          aria-checked="${color === currentColor}"
          aria-label="${color}"
          title="${color}"
        ></button>
      `).join('')}
    </div>
  `;

  // Clic sur un swatch → appliquer la couleur
  picker.addEventListener('click', (e) => {
    const swatch = e.target.closest('.color-swatch');
    if (!swatch) return;

    const newColor = swatch.dataset.color;
    const columnEl = document.querySelector(
      `.kanban-column[data-column-id="${columnId}"]`
    );

    if (columnEl) {
      // Mise à jour visuelle immédiate (optimistic)
      columnEl.style.setProperty('--col-accent', COLOR_MAP[newColor]);
      columnEl.dataset.color = newColor;

      // Marquer le swatch actif
      picker.querySelectorAll('.color-swatch').forEach(s => {
        s.classList.toggle('active', s.dataset.color === newColor);
        s.setAttribute('aria-checked', s.dataset.color === newColor);
      });

      // Appel API
      updateColumnColor(columnId, newColor);
      closePicker();
    }
  });

  // Positionner le picker sous la pastille
  anchorEl.style.position = 'relative';
  anchorEl.appendChild(picker);
  activePicker = picker;

  // Focus sur le swatch actif
  const activeSwitch = picker.querySelector('.color-swatch.active');
  if (activeSwitch) activeSwitch.focus();
}

function closePicker() {
  if (activePicker) {
    activePicker.remove();
    activePicker = null;
  }
}

/**
 * Appel API pour sauvegarder la couleur.
 * À adapter selon ton endpoint PHP existant.
 */
async function updateColumnColor(columnId, color) {
  try {
    await fetchWithAuth(`/api/columns/${columnId}`, {
      method: 'PATCH',
      body: JSON.stringify({ color }),
    });
  } catch (err) {
    // Rollback visuel si erreur
    console.error('Erreur mise à jour couleur:', err);
    showToast('Impossible de sauvegarder la couleur', 'error');
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HTML REQUIS — structure minimale à vérifier dans ton PHP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vérifie que le PHP génère (ou que le JS injecte) cette structure exacte.
Si le PHP génère du HTML statique, remplacer par ce squelette :

<div class="app-shell">

  <!-- Sidebar (si présente dans ton app) -->
  <aside class="app-sidebar" style="width: var(--sidebar-w);">
    <!-- ton contenu sidebar existant -->
  </aside>

  <!-- Zone principale -->
  <div class="app-main">

    <!-- Topbar -->
    <header class="board-topbar">
      <h1 class="board-title" id="boardTitle">Nom du tableau</h1>
      <div style="flex:1"></div>
      <button class="btn-add-column" id="btnAddColumn">
        <svg>...</svg> Nouvelle colonne
      </button>
    </header>

    <!-- LE CONTENEUR DES COLONNES — c'est lui qui doit être flex row -->
    <div class="board-scroll-area" id="boardContainer">
      <!-- Les colonnes sont injectées ici par renderBoard() -->
      <!-- Le bouton "Nouvelle colonne" est aussi ici, APRÈS les colonnes -->
    </div>

  </div>
</div>

POINTS DE VÉRIFICATION CRITIQUES :
□ .board-scroll-area a display:flex et flex-direction:row
□ Chaque .kanban-column a flex-shrink:0 et width:300px
□ html et body ont height:100% et overflow:hidden
□ .app-shell a height:100vh
□ La sidebar a une width fixe (pas de %)
□ Aucun parent de .board-scroll-area n'a overflow:hidden sur l'axe X

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHECKLIST FINALE AVANT DE VALIDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Layout :
  □ Les colonnes s'affichent CÔTE À CÔTE horizontalement
  □ Quand on crée une nouvelle colonne, elle apparaît À DROITE des existantes
  □ Le board utilise toute la largeur disponible (100vw - sidebar)
  □ Le scroll horizontal fonctionne quand il y a plus de 4 colonnes
  □ Chaque colonne a son propre scroll vertical indépendant
  □ Aucun scroll vertical global de la page (seules les colonnes scrollent)

Colonnes :
  □ Chaque colonne a une barre colorée en haut (3px)
  □ Le badge count change de couleur selon --col-accent
  □ Le menu ⋯ apparaît au hover
  □ La pastille couleur est cliquable et ouvre le color picker
  □ Le color picker s'ouvre/ferme correctement

Cartes :
  □ Les cartes ont une bande colorée gauche selon la priorité
  □ Hover : légère élévation (translateY -2px)
  □ Les dates en retard sont en rouge
  □ Drag & drop fonctionne entre les colonnes

Color picker :
  □ 12 swatches en grille 6x2
  □ La couleur active a un check blanc
  □ La couleur s'applique instantanément (optimistic)
  □ L'API est appelée en background
  □ Se ferme au clic dehors ou Escape
```
