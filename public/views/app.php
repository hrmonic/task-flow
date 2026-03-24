<?php
declare(strict_types=1);

use App\Services\CsrfService;

require_once dirname(__DIR__) . '/includes/base_path.php';
$tfBase = taskflow_public_base_path();

function tf_url(string $path): string
{
    global $tfBase;
    $path = str_starts_with($path, '/') ? $path : '/' . $path;

    return ($tfBase === '' ? '' : $tfBase) . $path;
}

$tfYear = (int) date('Y');
$csrfToken = htmlspecialchars(CsrfService::token(), ENT_QUOTES, 'UTF-8');
?>
<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0d0e14">
  <title>TaskFlow</title>
  <link rel="icon" type="image/png" href="<?= htmlspecialchars(tf_url('/assets/brand/taskflow-logo.png'), ENT_QUOTES, 'UTF-8') ?>">
  <meta name="taskflow-base" content="<?= htmlspecialchars($tfBase, ENT_QUOTES, 'UTF-8') ?>">
  <meta name="csrf-token" content="<?= $csrfToken ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/fonts.css'), ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/tokens.css'), ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/shell.css'), ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/taskflow.css'), ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/kanban.css'), ENT_QUOTES, 'UTF-8') ?>">
</head>
<body class="tf-shell app-shell">
  <a class="skip-link" href="#main-content">Aller au contenu principal</a>

  <header class="tf-header">
    <nav class="tf-container tf-nav-inner" aria-label="Navigation principale">
      <a class="tf-brand brand-plain" href="<?= htmlspecialchars(tf_url('/'), ENT_QUOTES, 'UTF-8') ?>" aria-label="TaskFlow — accueil">
        <img
          class="brand-mark"
          src="<?= htmlspecialchars(tf_url('/assets/brand/taskflow-logo.png'), ENT_QUOTES, 'UTF-8') ?>"
          width="176"
          height="40"
          alt="TaskFlow"
          decoding="async"
          fetchpriority="high"
        >
      </a>
      <button
        type="button"
        class="tf-nav-toggle"
        id="navMenuToggle"
        aria-controls="navMain"
        aria-expanded="false"
        aria-label="Ouvrir ou fermer le menu"
      >
        <span class="tf-nav-toggle-icon" aria-hidden="true"></span>
      </button>
      <div class="tf-nav-panel" id="navMain">
        <ul class="tf-nav-links">
          <li>
            <a href="#main-content" data-nav-target="main">Accueil</a>
          </li>
          <li class="guest-only">
            <a href="#authSection" data-nav-target="auth">Connexion</a>
          </li>
          <li class="app-only">
            <a href="#boardSection" data-nav-target="boards">Tableaux</a>
          </li>
          <li class="app-only">
            <button type="button" id="openAccountBtn">Mon compte</button>
          </li>
          <li class="app-only">
            <button type="button" id="openInvitationsBtn">Invitations <span id="navInvitationCount" class="tf-nav-badge" hidden>0</span></button>
          </li>
          <li>
            <a href="#aboutSection" data-nav-target="about">À propos</a>
          </li>
        </ul>
        <div class="tf-nav-user">
          <button type="button" id="themeToggleBtn" class="tf-btn tf-btn--ghost tf-btn--sm" aria-pressed="false" aria-label="Activer le mode clair">
            <span class="theme-toggle-label">Activer le mode clair</span>
            <span class="theme-toggle-icon" aria-hidden="true"></span>
          </button>
          <span id="navUserLabel" class="tf-nav-user-label" hidden></span>
          <button type="button" id="logoutBtn" class="tf-btn tf-btn--ghost tf-btn--sm" hidden>Déconnexion</button>
        </div>
      </div>
    </nav>
  </header>

  <main id="main-content" class="app-main" tabindex="-1">
    <div class="tf-container">

      <section id="dashboardSection" class="mb-4" hidden aria-label="Tableau de bord">
        <div class="dashboard-hero tf-card tf-card-body mb-4">
          <p class="auth-kicker mb-2">Espace connecté</p>
          <h1 class="tf-h1 mb-2" style="font-size:clamp(1.35rem, 3vw, 1.85rem)">Bon retour sur TaskFlow</h1>
          <p class="tf-muted mb-0 col-about">
            Gérez vos colonnes et tâches en Kanban, synchronisées via l’API. Raccourcis : <kbd class="tf-kbd">N</kbd> nouvelle tâche (colonne focus), <kbd class="tf-kbd">C</kbd> colonne, <kbd class="tf-kbd">Ctrl+K</kbd> commandes, <kbd class="tf-kbd">?</kbd> aide, <kbd class="tf-kbd">Échap</kbd> fermer, <kbd class="tf-kbd">Ctrl+Z</kbd> annuler déplacement.
          </p>
        </div>
        <div class="tf-grid tf-grid--dash">
          <div class="tf-card">
            <div class="tf-card-body">
              <h2 class="tf-h3" style="font-size:1.1rem">Tableaux Kanban</h2>
              <p class="tf-muted">Sélectionnez un tableau, éditez les colonnes et faites glisser les cartes.</p>
              <button type="button" class="tf-btn tf-btn--primary" data-nav-target="boards">Ouvrir les tableaux</button>
            </div>
          </div>
          <div class="tf-card">
            <div class="tf-card-body">
              <h2 class="tf-h3" style="font-size:1.1rem">Mon compte</h2>
              <p class="tf-muted">Consultez votre profil ou changez votre mot de passe en sécurité.</p>
              <button type="button" class="tf-btn tf-btn--ghost" id="openAccountFromDashboard">Voir le compte</button>
            </div>
          </div>
          <div class="tf-card">
            <div class="tf-card-body">
              <h2 class="tf-h3" style="font-size:1.1rem">À propos</h2>
              <p class="tf-muted">Stack technique et mentions du projet TaskFlow.</p>
              <a href="#aboutSection" class="tf-btn tf-btn--ghost" data-nav-target="about">Lire la présentation</a>
            </div>
          </div>
        </div>
      </section>

      <section id="authSection" class="auth-panel" aria-busy="true" aria-label="Authentification">
        <p id="authBootFallback" class="tf-muted px-1">Chargement de l’interface…</p>
      </section>

      <section id="boardSection" hidden aria-label="Tableaux Kanban">
        <div class="tf-board-head">
          <div class="board-head-top">
            <h2 class="tf-h2" style="font-size:1.25rem;margin:0">Tableau actif</h2>
            <div class="board-head-toggles">
              <button type="button" id="toggleSidebarBtn" class="tf-btn tf-btn--ghost tf-btn--sm">Masquer la barre latérale</button>
              <button type="button" id="toggleBoardInfoBtn" class="tf-btn tf-btn--ghost tf-btn--sm">Masquer les informations</button>
              <button type="button" id="toggleBoardActivityBtn" class="tf-btn tf-btn--ghost tf-btn--sm">Masquer l'historique</button>
            </div>
          </div>
          <p class="tf-muted board-head-hint">Modifiez le tableau sélectionné.</p>
        </div>

        <div class="tf-board-layout">
          <aside id="boardSidebar" class="tf-board-sidebar" hidden aria-label="Liste des tableaux">
            <p class="tf-board-sidebar-title">Tableaux</p>
            <div class="tf-board-create">
              <label class="tf-sr-only" for="sidebarNewBoardName">Créer un nouveau tableau</label>
              <div class="tf-board-create-row">
                <input id="sidebarNewBoardName" type="text" class="tf-input tf-board-create-input" placeholder="Nouveau tableau..." autocomplete="off" maxlength="120" aria-label="Nom du nouveau tableau">
                <button id="sidebarCreateBoardBtn" type="button" class="tf-board-create-btn" aria-label="Valider la création du tableau" title="Valider">
                  <span aria-hidden="true">✓</span>
                </button>
              </div>
            </div>
            <ul id="boardSidebarList" class="tf-board-list"></ul>
          </aside>
          <div class="tf-board-main">
            <div id="boardInfoPanel" class="tf-card board-toolbar-card mb-3">
              <div class="tf-card-body board-toolbar-body">
                <label class="tf-sr-only" for="boardSelect">Choisir un tableau</label>
                <select id="boardSelect" class="tf-hidden-select" aria-hidden="true" tabindex="-1" title="Synchronisation interne"></select>

                <div class="toolbar-grid">
                  <div class="tf-field toolbar-field--active">
                    <label class="tf-label" for="boardTitleInput">Titre du tableau actif</label>
                    <div class="tf-input-row">
                      <input id="boardTitleInput" type="text" class="tf-input" placeholder="Ex. Sprint marketing Q2" autocomplete="off" maxlength="120" aria-label="Titre du tableau actif">
                      <button type="button" id="saveBoardBtn" class="tf-btn tf-btn--primary">Enregistrer</button>
                    </div>
                    <div class="board-icon-picker">
                      <label class="tf-label board-icon-picker-label" for="boardJobSelect">Métier</label>
                      <select id="boardJobSelect" class="tf-select board-icon-select" aria-label="Choisir le métier du tableau"></select>
                      <div class="board-icon-row">
                        <div class="board-icon-select-wrap">
                          <label class="tf-label board-icon-picker-label" for="boardIconSelect">Pictogramme associé</label>
                          <select id="boardIconSelect" class="tf-select board-icon-select" aria-label="Choisir le pictogramme du tableau"></select>
                        </div>
                        <div id="boardIconPreview" class="board-icon-preview" aria-hidden="true"></div>
                      </div>
                    </div>
                    <div class="board-contributor-create">
                      <label class="tf-label board-icon-picker-label" for="boardContributorInput">Ajouter un contributeur (email ou nom)</label>
                      <div class="tf-input-row">
                        <input id="boardContributorInput" type="text" class="tf-input" placeholder="ex: marie@entreprise.com ou Marie" autocomplete="off" maxlength="190" aria-label="Ajouter un contributeur">
                        <button type="button" id="boardInviteBtn" class="tf-btn tf-btn--ghost">Inviter</button>
                      </div>
                    </div>
                    <div id="boardContributorsList" class="board-contributors-list"></div>
                  </div>
                  <div class="tf-field toolbar-field--desc">
                    <label class="tf-label" for="boardDescInput">Description du tableau actif</label>
                    <textarea id="boardDescInput" class="tf-textarea" rows="3" maxlength="2000" placeholder="Objectifs, périmètre, liens, notes d'équipe..." aria-label="Description du tableau actif"></textarea>
                  </div>
                  <div class="danger-zone-card tf-card toolbar-danger">
                    <div class="tf-card-body py-3">
                      <span class="tf-label" style="color:var(--color-danger)">Zone sensible</span>
                      <p class="toolbar-help">Suppression définitive du tableau actif.</p>
                      <button type="button" id="deleteBoardBtn" class="tf-btn tf-btn--danger tf-btn--sm">Supprimer ce tableau</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="boardToolbarError" class="board-inline-error" hidden role="alert" aria-live="polite"></div>
            <div id="invitationPanel" class="tf-card invitation-panel" hidden>
              <div class="tf-card-body">
                <h3 class="tf-h3" style="font-size:1rem;margin-bottom:0.5rem">Invitations reçues</h3>
                <div id="invitationList" class="invitation-list"></div>
              </div>
            </div>
            <div id="kanbanBoard" class="kanban-board" aria-busy="false"></div>
            <div id="boardActivityPanel" class="tf-card board-activity-panel mt-2">
              <div class="tf-card-body">
                <h3 class="tf-h3" style="font-size:1rem;margin-bottom:0.5rem">Historique des modifications</h3>
                <div id="boardActivityList" class="board-activity-list"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="aboutSection" class="py-4 py-md-5 mt-2 about-section" aria-labelledby="aboutTitle">
        <div class="about-inner">
          <h2 id="aboutTitle" class="tf-h2 mb-3">À propos de TaskFlow</h2>
          <p class="tf-lead mb-3">
            TaskFlow est une application Kanban de démonstration : tableaux, colonnes personnalisables, tâches avec priorité et glisser-déposer. Interface lisible, accessible, thème sombre Precision Dark (CSS et JS vanilla).
          </p>
          <ul class="about-grid">
            <li>
              <div class="about-tile tf-card tf-card-body">
                <strong class="d-block mb-1">Backend</strong>
                <span class="tf-muted">PHP 8.2, API REST, JWT, MySQL</span>
              </div>
            </li>
            <li>
              <div class="about-tile tf-card tf-card-body">
                <strong class="d-block mb-1">Frontend</strong>
                <span class="tf-muted">JavaScript modules, design system maison, polices locales</span>
              </div>
            </li>
            <li>
              <div class="about-tile tf-card tf-card-body">
                <strong class="d-block mb-1">Déploiement</strong>
                <span class="tf-muted">Docker, variables d’environnement</span>
              </div>
            </li>
            <li>
              <div class="about-tile tf-card tf-card-body">
                <strong class="d-block mb-1">Usage</strong>
                <span class="tf-muted">Personnel ou démo — ne pas y stocker de données sensibles en production sans durcissement.</span>
              </div>
            </li>
          </ul>
          <p class="tf-muted mt-4 mb-0">© <?= $tfYear ?> TaskFlow — usage personnel ou démo.</p>
        </div>
      </section>
    </div>
  </main>

  <footer id="page-footer" class="site-footer py-4">
    <div class="tf-container">
      <div class="footer-row">
        <div>
          <strong class="d-block">TaskFlow</strong>
          <p class="site-footer-tagline tf-muted mb-0 mt-1">Kanban · PHP 8.2 · MySQL · API REST · JWT · Docker</p>
        </div>
        <div class="footer-links-wrap">
          <nav class="footer-nav" aria-label="Liens pied de page">
            <a href="#main-content" data-nav-target="main">Haut de page</a>
            <a href="#boardSection" class="app-only-footer" data-nav-target="boards">Tableaux</a>
            <a href="https://www.php.net/releases/8.2/index.php" target="_blank" rel="noopener noreferrer">PHP 8.2</a>
          </nav>
          <p class="tf-muted small mb-0">© <?= $tfYear ?> TaskFlow</p>
        </div>
      </div>
    </div>
  </footer>

  <div id="taskModal" class="tf-modal-host" hidden></div>
  <div id="columnModal" class="tf-modal-host" hidden></div>
  <div id="accountModal" class="tf-modal-host" hidden></div>
  <div id="commandPalette" class="tf-palette-host" hidden></div>
  <div id="shortcutHelp" class="tf-modal-host" hidden></div>
  <div id="toastHost" class="tf-toast-host" aria-live="polite"></div>

  <script type="module" src="<?= htmlspecialchars(tf_url('/assets/js/app.js'), ENT_QUOTES, 'UTF-8') ?>"></script>
</body>
</html>
