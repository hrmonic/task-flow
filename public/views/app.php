<?php
declare(strict_types=1);
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TaskFlow</title>
  <link rel="stylesheet" href="/assets/css/tokens.css">
  <link rel="stylesheet" href="/assets/css/layout.css">
  <link rel="stylesheet" href="/assets/css/kanban.css">
  <link rel="stylesheet" href="/assets/css/auth.css">
  <link rel="stylesheet" href="/assets/css/components.css">
</head>
<body>
  <header class="topbar">
    <h1>TaskFlow</h1>
    <button id="logoutBtn" class="btn secondary">Logout</button>
  </header>
  <main>
    <section id="authSection" class="auth-panel"></section>
    <section id="boardSection" class="hidden">
      <div class="board-toolbar">
        <input id="newBoardName" placeholder="New board name">
        <button id="createBoardBtn" class="btn">Create Board</button>
        <select id="boardSelect"></select>
      </div>
      <div id="kanbanBoard" class="kanban-board"></div>
    </section>
  </main>
  <div id="taskModal" class="modal hidden"></div>
  <script type="module" src="/assets/js/app.js"></script>
</body>
</html>
