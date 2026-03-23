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
?>
<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TaskFlow</title>
  <meta name="taskflow-base" content="<?= htmlspecialchars($tfBase, ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/tokens.css'), ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/layout.css'), ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/kanban.css'), ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/auth.css'), ENT_QUOTES, 'UTF-8') ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(tf_url('/assets/css/components.css'), ENT_QUOTES, 'UTF-8') ?>">
</head>
<body>
  <header class="topbar">
    <h1>TaskFlow</h1>
    <button type="button" id="logoutBtn" class="btn secondary" hidden>Logout</button>
  </header>
  <main>
    <section id="authSection" class="auth-panel" aria-busy="true">
      <p id="authBootFallback">Chargement de l'interface…</p>
    </section>
    <section id="boardSection" hidden>
      <div class="board-toolbar">
        <input id="newBoardName" placeholder="New board name">
        <button id="createBoardBtn" class="btn">Create Board</button>
        <select id="boardSelect"></select>
      </div>
      <div id="kanbanBoard" class="kanban-board"></div>
    </section>
  </main>
  <div id="taskModal" class="modal" hidden></div>
  <script type="module" src="<?= htmlspecialchars(tf_url('/assets/js/app.js'), ENT_QUOTES, 'UTF-8') ?>"></script>
</body>
</html>
