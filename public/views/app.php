<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/base_path.php';
$tfBase = taskflow_public_base_path();

function tf_url(string $path): string
{
    global $tfBase;
    $path = str_starts_with($path, '/') ? $path : '/' . $path;

    return ($tfBase === '' ? '' : $tfBase) . $path;
}

$tfYear = (int) date('Y');
?>
<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0a0f1a">
  <title>TaskFlow</title>
  <link rel="icon" type="image/png" href="<?= htmlspecialchars(tf_url('/assets/brand/taskflow-logo.png'), ENT_QUOTES, 'UTF-8') ?>">
  <meta name="taskflow-base" content="<?= htmlspecialchars($tfBase, ENT_QUOTES, 'UTF-8') ?>">
  <style>
    html { background: #0c1222; color: #f1f5f9; }
    body, h1, h2, h3, h4, button, input, textarea, select {
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    a.brand, a.brand:visited, a.brand:hover, a.brand:active {
      color: inherit;
      text-decoration: none;
    }
    .brand-mark {
      display: block;
      height: 2.5rem;
      width: auto;
      max-width: 12rem;
      object-fit: contain;
      object-position: left center;
      flex-shrink: 0;
    }
  </style>
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/tokens.css'), ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/layout.css'), ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/kanban.css'), ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/components.css'), ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/auth.css'), ENT_QUOTES, 'UTF-8') ?>">
</head>
<body class="app-shell">
  <a class="skip-link" href="#main-content">Aller au contenu principal</a>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="topbar-start">
        <a class="brand" href="<?= htmlspecialchars(tf_url('/'), ENT_QUOTES, 'UTF-8') ?>" aria-label="TaskFlow — accueil">
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
          id="navToggle"
          class="nav-toggle btn secondary"
          aria-controls="navMain"
          aria-expanded="false"
          aria-label="Ouvrir ou fermer le menu"
        >Menu</button>
      </div>
      <nav id="navMain" class="main-nav" aria-label="Navigation principale">
        <ul class="main-nav-list">
          <li><a href="#main-content" class="nav-link" data-nav-target="main">Accueil</a></li>
          <li class="guest-only"><a href="#authSection" class="nav-link" data-nav-target="auth">Connexion</a></li>
          <li class="app-only"><a href="#boardSection" class="nav-link" data-nav-target="boards">Tableaux</a></li>
          <li><a href="#page-footer" class="nav-link" data-nav-target="footer">À propos</a></li>
        </ul>
      </nav>
      <div class="topbar-end">
        <span id="navUserLabel" class="nav-user" hidden></span>
        <button type="button" id="logoutBtn" class="btn secondary" hidden aria-label="Se déconnecter">Déconnexion</button>
      </div>
    </div>
  </header>

  <main id="main-content" class="app-main" tabindex="-1">
    <section id="authSection" class="auth-panel" aria-busy="true" aria-label="Authentification">
      <p id="authBootFallback">Chargement de l'interface…</p>
    </section>
    <section id="boardSection" hidden aria-label="Tableaux Kanban">
      <div class="board-toolbar" role="group" aria-label="Gestion des tableaux">
        <div class="toolbar-cluster toolbar-cluster--grow">
          <label class="field-label" for="boardSelect">Tableau actif</label>
          <select id="boardSelect" class="toolbar-select" aria-label="Choisir un tableau"></select>
        </div>
        <div class="toolbar-cluster">
          <label class="field-label" for="boardTitleInput">Nom du tableau</label>
          <div class="toolbar-inline">
            <input id="boardTitleInput" type="text" class="toolbar-input" placeholder="Nom" autocomplete="off" maxlength="120" aria-label="Nom du tableau">
            <button type="button" id="saveBoardBtn" class="btn">Enregistrer</button>
          </div>
        </div>
        <div class="toolbar-cluster toolbar-cluster--wide">
          <label class="field-label" for="boardDescInput">Description</label>
          <textarea id="boardDescInput" class="toolbar-textarea" rows="2" maxlength="2000" placeholder="Optionnel — objectifs, lien sprint…" aria-label="Description du tableau"></textarea>
        </div>
        <div class="toolbar-cluster toolbar-cluster--new">
          <label class="field-label" for="newBoardName">Nouveau tableau</label>
          <div class="toolbar-inline">
            <input id="newBoardName" type="text" class="toolbar-input" placeholder="Ex. Sprint 12" autocomplete="off" maxlength="120">
            <button id="createBoardBtn" type="button" class="btn">Créer</button>
          </div>
        </div>
        <div class="toolbar-cluster toolbar-cluster--danger">
          <label class="field-label" for="deleteBoardBtn">Zone sensible</label>
          <button type="button" id="deleteBoardBtn" class="btn danger">Supprimer ce tableau</button>
        </div>
      </div>
      <div id="boardToolbarError" class="board-inline-error" hidden role="alert" aria-live="polite"></div>
      <div id="kanbanBoard" class="kanban-board" aria-busy="false"></div>
    </section>
  </main>

  <footer id="page-footer" class="site-footer">
    <div class="site-footer-inner">
      <div class="site-footer-brand">
        <strong>TaskFlow</strong>
        <p class="site-footer-tagline">Kanban · PHP 8.2 · MySQL · API REST · JWT · Docker</p>
      </div>
      <nav class="site-footer-nav" aria-label="Liens pied de page">
        <a href="#main-content" class="footer-link" data-nav-target="main">Haut de page</a>
        <a href="#boardSection" class="footer-link app-only-footer" data-nav-target="boards">Tableaux</a>
        <a href="https://www.php.net/releases/8.2/index.php" class="footer-link" target="_blank" rel="noopener noreferrer">PHP 8.2</a>
      </nav>
      <p class="site-footer-copy">© <?= $tfYear ?> TaskFlow — usage personnel ou démo.</p>
    </div>
  </footer>

  <div id="taskModal" class="modal" hidden></div>
  <div id="columnModal" class="modal" hidden></div>
  <script type="module" src="<?= htmlspecialchars(tf_url('/assets/js/app.js'), ENT_QUOTES, 'UTF-8') ?>"></script>
</body>
</html>
