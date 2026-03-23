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
<html lang="fr" data-bs-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0c1222">
  <title>TaskFlow</title>
  <link rel="icon" type="image/png" href="<?= htmlspecialchars(tf_url('/assets/brand/taskflow-logo.png'), ENT_QUOTES, 'UTF-8') ?>">
  <meta name="taskflow-base" content="<?= htmlspecialchars($tfBase, ENT_QUOTES, 'UTF-8') ?>">
  <meta name="csrf-token" content="<?= $csrfToken ?>">
  <!-- Bootstrap 5.3.3 en local (CSP : style-src / script-src limités à 'self'). -->
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/vendor/bootstrap/5.3.3/css/bootstrap.min.css'), ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/tokens.css'), ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/taskflow.css'), ENT_QUOTES, 'UTF-8') ?>">
</head>
<body class="app-shell bg-body text-body d-flex flex-column min-vh-100">
  <a class="skip-link" href="#main-content">Aller au contenu principal</a>

  <header class="sticky-top border-bottom border-secondary shadow-sm">
    <nav class="navbar navbar-expand-lg navbar-dark bg-body-tertiary py-2" aria-label="Navigation principale">
      <div class="container-fluid px-3 px-lg-4" style="max-width:90rem">
        <a class="navbar-brand d-flex align-items-center py-0 me-lg-4 brand-plain" href="<?= htmlspecialchars(tf_url('/'), ENT_QUOTES, 'UTF-8') ?>" aria-label="TaskFlow — accueil">
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
          class="navbar-toggler border-secondary"
          data-bs-toggle="collapse"
          data-bs-target="#navMain"
          aria-controls="navMain"
          aria-expanded="false"
          aria-label="Ouvrir ou fermer le menu"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav mx-lg-auto mb-2 mb-lg-0 gap-lg-1 align-items-lg-center">
            <li class="nav-item">
              <a href="#main-content" class="nav-link rounded px-3" data-nav-target="main">Accueil</a>
            </li>
            <li class="nav-item guest-only">
              <a href="#authSection" class="nav-link rounded px-3" data-nav-target="auth">Connexion</a>
            </li>
            <li class="nav-item app-only">
              <a href="#boardSection" class="nav-link rounded px-3" data-nav-target="boards">Tableaux</a>
            </li>
            <li class="nav-item app-only">
              <button type="button" class="nav-link rounded px-3 border-0 bg-transparent text-start w-100 w-lg-auto" id="openAccountBtn">Mon compte</button>
            </li>
            <li class="nav-item">
              <a href="#aboutSection" class="nav-link rounded px-3" data-nav-target="about">À propos</a>
            </li>
          </ul>
          <div class="d-flex flex-column flex-lg-row align-items-lg-center gap-2 ms-lg-3 pt-2 pt-lg-0 border-top border-secondary mt-2 mt-lg-0 pt-lg-0 border-lg-0">
            <span id="navUserLabel" class="small text-secondary text-truncate" style="max-width:12rem" hidden></span>
            <button type="button" id="logoutBtn" class="btn btn-outline-light btn-sm" hidden>Déconnexion</button>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <main id="main-content" class="app-main flex-grow-1 py-3 py-md-4" tabindex="-1">
    <div class="container-fluid px-3 px-lg-4">

      <section id="dashboardSection" class="mb-4" hidden aria-label="Tableau de bord">
        <div class="dashboard-hero rounded-4 p-4 p-md-5 mb-4">
          <p class="auth-kicker mb-2">Espace connecté</p>
          <h1 class="display-6 fw-bold mb-2">Bon retour sur TaskFlow</h1>
          <p class="text-secondary mb-4 mb-md-0 col-lg-8 px-0">
            Gérez vos colonnes et tâches en Kanban, synchronisées via l’API. Utilisez les raccourcis ci-dessous pour accéder rapidement aux fonctionnalités.
          </p>
        </div>
        <div class="row g-3 g-md-4">
          <div class="col-md-6 col-xl-4">
            <div class="card h-100 bg-body-tertiary border-secondary shadow-sm">
              <div class="card-body">
                <h2 class="h5 card-title">Tableaux Kanban</h2>
                <p class="card-text text-secondary small">Sélectionnez un tableau, éditez les colonnes et faites glisser les cartes.</p>
                <button type="button" class="btn btn-primary" data-nav-target="boards">Ouvrir les tableaux</button>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-xl-4">
            <div class="card h-100 bg-body-tertiary border-secondary shadow-sm">
              <div class="card-body">
                <h2 class="h5 card-title">Mon compte</h2>
                <p class="card-text text-secondary small">Consultez votre profil ou changez votre mot de passe en sécurité.</p>
                <button type="button" class="btn btn-outline-info" id="openAccountFromDashboard">Voir le compte</button>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-xl-4">
            <div class="card h-100 bg-body-tertiary border-secondary shadow-sm">
              <div class="card-body">
                <h2 class="h5 card-title">À propos</h2>
                <p class="card-text text-secondary small">Stack technique et mentions du projet TaskFlow.</p>
                <a href="#aboutSection" class="btn btn-outline-secondary" data-nav-target="about">Lire la présentation</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="authSection" class="auth-panel" aria-busy="true" aria-label="Authentification">
        <p id="authBootFallback" class="text-secondary px-1">Chargement de l’interface…</p>
      </section>

      <section id="boardSection" hidden aria-label="Tableaux Kanban">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <h2 class="h4 mb-0 fw-semibold">Tableau actif</h2>
          <p class="text-secondary small mb-0 d-none d-md-block">Modifiez le tableau sélectionné ou créez-en un nouveau.</p>
        </div>

        <div class="card board-toolbar-card bg-body-tertiary border-secondary shadow-sm mb-3">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6 col-xl-4">
                <label class="form-label small fw-semibold mb-1" for="boardSelect">Tableau actif</label>
                <select id="boardSelect" class="form-select" aria-label="Choisir un tableau"></select>
              </div>
              <div class="col-md-6 col-xl-4">
                <label class="form-label small fw-semibold mb-1" for="boardTitleInput">Nom du tableau</label>
                <div class="input-group">
                  <input id="boardTitleInput" type="text" class="form-control" placeholder="Nom" autocomplete="off" maxlength="120" aria-label="Nom du tableau">
                  <button type="button" id="saveBoardBtn" class="btn btn-primary">Enregistrer</button>
                </div>
              </div>
              <div class="col-12 col-xl-4">
                <label class="form-label small fw-semibold mb-1" for="boardDescInput">Description</label>
                <textarea id="boardDescInput" class="form-control" rows="2" maxlength="2000" placeholder="Optionnel — objectifs, lien sprint…" aria-label="Description du tableau"></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-semibold mb-1" for="newBoardName">Nouveau tableau</label>
                <div class="input-group">
                  <input id="newBoardName" type="text" class="form-control" placeholder="Ex. Sprint 12" autocomplete="off" maxlength="120">
                  <button id="createBoardBtn" type="button" class="btn btn-success">Créer</button>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card danger-zone-card h-100 border">
                  <div class="card-body py-3">
                    <span class="form-label small fw-semibold text-danger mb-2 d-block">Zone sensible</span>
                    <button type="button" id="deleteBoardBtn" class="btn btn-outline-danger w-100 w-md-auto">Supprimer ce tableau</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="boardToolbarError" class="board-inline-error" hidden role="alert" aria-live="polite"></div>
        <div id="kanbanBoard" class="kanban-board" aria-busy="false"></div>
      </section>

      <section id="aboutSection" class="py-4 py-md-5 mt-2 border-top border-secondary" aria-labelledby="aboutTitle">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-xl-8">
            <h2 id="aboutTitle" class="h3 fw-bold mb-3">À propos de TaskFlow</h2>
            <p class="text-secondary lead fs-6">
              TaskFlow est une application Kanban de démonstration : tableaux, colonnes personnalisables, tâches avec priorité et glisser-déposer. L’objectif est une interface lisible, accessible et cohérente sur fond sombre.
            </p>
            <ul class="list-unstyled row g-3 mt-2">
              <li class="col-sm-6">
                <div class="p-3 rounded-3 bg-body-tertiary border border-secondary h-100">
                  <strong class="d-block mb-1">Backend</strong>
                  <span class="text-secondary small">PHP 8.2, API REST, JWT, MySQL</span>
                </div>
              </li>
              <li class="col-sm-6">
                <div class="p-3 rounded-3 bg-body-tertiary border border-secondary h-100">
                  <strong class="d-block mb-1">Frontend</strong>
                  <span class="text-secondary small">Bootstrap 5, JavaScript modules, thème sombre</span>
                </div>
              </li>
              <li class="col-sm-6">
                <div class="p-3 rounded-3 bg-body-tertiary border border-secondary h-100">
                  <strong class="d-block mb-1">Déploiement</strong>
                  <span class="text-secondary small">Docker, variables d’environnement</span>
                </div>
              </li>
              <li class="col-sm-6">
                <div class="p-3 rounded-3 bg-body-tertiary border border-secondary h-100">
                  <strong class="d-block mb-1">Usage</strong>
                  <span class="text-secondary small">Personnel ou démo — ne pas y stocker de données sensibles en production sans durcissement.</span>
                </div>
              </li>
            </ul>
            <p class="text-secondary small mt-4 mb-0">© <?= $tfYear ?> TaskFlow — usage personnel ou démo.</p>
          </div>
        </div>
      </section>
    </div>
  </main>

  <footer id="page-footer" class="site-footer py-4">
    <div class="container-fluid px-3 px-lg-4" style="max-width:90rem">
      <div class="row align-items-start g-3">
        <div class="col-md-6">
          <strong class="d-block">TaskFlow</strong>
          <p class="site-footer-tagline text-secondary small mb-0 mt-1">Kanban · PHP 8.2 · MySQL · API REST · JWT · Docker</p>
        </div>
        <div class="col-md-6 text-md-end">
          <nav class="d-flex flex-wrap gap-2 justify-content-md-end mb-2" aria-label="Liens pied de page">
            <a href="#main-content" class="link-info text-decoration-none small" data-nav-target="main">Haut de page</a>
            <a href="#boardSection" class="link-info text-decoration-none small app-only-footer" data-nav-target="boards">Tableaux</a>
            <a href="https://www.php.net/releases/8.2/index.php" class="link-secondary text-decoration-none small" target="_blank" rel="noopener noreferrer">PHP 8.2</a>
          </nav>
          <p class="text-secondary small mb-0">© <?= $tfYear ?> TaskFlow</p>
        </div>
      </div>
    </div>
  </footer>

  <div id="taskModal" class="tf-modal-host" hidden></div>
  <div id="columnModal" class="tf-modal-host" hidden></div>
  <div id="accountModal" class="tf-modal-host" hidden></div>

  <script src="<?= htmlspecialchars(tf_url('/assets/vendor/bootstrap/5.3.3/js/bootstrap.bundle.min.js'), ENT_QUOTES, 'UTF-8') ?>"></script>
  <script type="module" src="<?= htmlspecialchars(tf_url('/assets/js/app.js'), ENT_QUOTES, 'UTF-8') ?>"></script>
</body>
</html>
