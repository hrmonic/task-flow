import { clearHistory, pushMoveSnapshot } from "./boardHistory.js";
import { apiFetch } from "./api.js";
import { openColumnModal } from "./columnModal.js";
import {
  escapeHtml,
  formatRelativeDueDate,
  taskPriorityClass,
  taskPriorityLabel,
} from "./escape.js";
import { openTaskModal } from "./taskModal.js";

let lastLoadedBoardId = null;
const TASK_DONE_STORAGE_KEY = "taskflow_task_done";
const BOARD_CACHE_STORAGE_KEY = "taskflow_board_cache_v1";

function getBoardCacheMap() {
  try {
    const raw = localStorage.getItem(BOARD_CACHE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function setBoardCacheMap(map) {
  localStorage.setItem(BOARD_CACHE_STORAGE_KEY, JSON.stringify(map));
}

function getBoardCache(boardId) {
  const map = getBoardCacheMap();
  const entry = map[boardId];
  if (!entry || !Array.isArray(entry.columns)) return null;
  return entry.columns;
}

function setBoardCache(boardId, columns) {
  if (!boardId || !Array.isArray(columns)) return;
  const map = getBoardCacheMap();
  map[boardId] = {
    updated_at: Date.now(),
    columns,
  };
  setBoardCacheMap(map);
}

async function fetchBoardData(boardId) {
  const columns = await apiFetch(`/api/boards/${boardId}/columns`);
  const withTasks = await Promise.all(
    columns.map(async (col) => ({
      ...col,
      tasks: await apiFetch(`/api/columns/${col.id}/tasks`),
    })),
  );
  setBoardCache(boardId, withTasks);
  return withTasks;
}

function getTaskDoneMap() {
  try {
    const raw = localStorage.getItem(TASK_DONE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function setTaskDoneMap(map) {
  localStorage.setItem(TASK_DONE_STORAGE_KEY, JSON.stringify(map));
}

function setTaskDone(taskId, isDone) {
  const map = getTaskDoneMap();
  if (isDone) {
    map[taskId] = 1;
  } else {
    delete map[taskId];
  }
  setTaskDoneMap(map);
}

function boardSelectValue() {
  const sel = document.getElementById("boardSelect");
  return sel ? sel.value : "";
}

export async function reloadActiveBoard() {
  await loadBoard(boardSelectValue(), { force: true });
}

function renderBoardSkeleton() {
  const board = document.getElementById("kanbanBoard");
  if (!board) return;
  const col = () => `<div class="tf-skeleton-col" aria-hidden="true">
      <div class="tf-skeleton-line tf-skeleton-line--short"></div>
      <div class="tf-skeleton-card"></div>
      <div class="tf-skeleton-card"></div>
    </div>`;
  board.innerHTML = `<div class="tf-skeleton-board">${col()}${col()}${col()}</div>`;
}

export async function loadBoard(boardId, options = {}) {
  const force = Boolean(options.force);
  if (!boardId) return;
  if (lastLoadedBoardId !== boardId) {
    clearHistory();
    lastLoadedBoardId = boardId;
  }
  const board = document.getElementById("kanbanBoard");
  if (board) {
    board.setAttribute("aria-busy", "true");
    renderBoardSkeleton();
  }
  try {
    const cached = !force ? getBoardCache(boardId) : null;
    if (cached) {
      renderBoard(cached);
      return;
    }
    const withTasks = await fetchBoardData(boardId);
    renderBoard(withTasks);
  } catch (err) {
    if (board) board.replaceChildren();
    throw err;
  } finally {
    if (board) board.setAttribute("aria-busy", "false");
  }
}

function wireTaskCard(taskEl, task) {
  const openEditor = () => {
    openTaskModal({
      task,
      // MODIFIER LA CARTE
      onSave: async (payload) => {
        await apiFetch(`/api/tasks/${task.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        await reloadActiveBoard();
      },
      // SUPPRIMER LA CARTE
      onDelete: async (taskId) => {
        await apiFetch(`/api/tasks/${taskId}`, { method: "DELETE" });
        await reloadActiveBoard();
      },
    });
  };

  taskEl.addEventListener("click", (e) => {
    if (e.target.closest("a, button, input, label")) return;
    openEditor();
  });

  taskEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEditor();
    }
  });
}

export function renderBoard(columns) {
  const board = document.getElementById("kanbanBoard");
  if (!board) return;
  const boardId = boardSelectValue();
  const doneMap = getTaskDoneMap();
  const columnsHtml = columns
    .map((col) => {
      const colId = escapeHtml(col.id);
      const colName = escapeHtml(col.name);
      const rawColor = typeof col.color === "string" && /^#[0-9A-Fa-f]{6}$/.test(col.color)
        ? col.color
        : "#64748b";
      const colColor = escapeHtml(rawColor);
      const tasksHtml = col.tasks
        .map((t) => {
          const pr = taskPriorityClass(t.priority);
          const title = escapeHtml(t.title);
          const desc = escapeHtml(t.description || "");
          const taskId = escapeHtml(t.id);
          const prLabel = escapeHtml(taskPriorityLabel(t.priority));
          const dueRel = formatRelativeDueDate(t.due_date);
          const dueHtml = dueRel
            ? `<span class="task-due">${escapeHtml(dueRel)}</span>`
            : "";
          const isDone = Boolean(doneMap[t.id]);
          const stateClass = isDone ? "task--done" : "task--inprogress";
          const checkedAttr = isDone ? " checked" : "";
          return `<article class="task priority-${pr} ${stateClass}" draggable="true" data-task-id="${taskId}" tabindex="0" role="listitem" aria-label="Tâche : ${title}. Appuyez sur Entrée pour modifier.">
                <h4>${title}</h4>${desc ? `<p>${desc}</p>` : ""}
                <div class="task-card-footer">
                  <label class="task-check-toggle">
                    <input type="checkbox" class="task-complete-toggle" data-task-id="${taskId}"${checkedAttr} />
                    <span>Terminée</span>
                  </label>
                  <span class="task-priority-pill task-priority-pill--${pr}"><span class="task-priority-dot" aria-hidden="true"></span>${prLabel}</span>
                  ${dueHtml}
                </div>
              </article>`;
        })
        .join("");
          return `
      <section class="kanban-column" data-column-id="${colId}" aria-label="Colonne ${colName}" style="--column-accent:${colColor}">
        <header class="column-header">
          <div class="column-header-row">
            <div class="column-header-left">
              <span class="column-stripe" aria-hidden="true"></span>
              <h3 class="column-drag-handle" draggable="true" title="Glisser pour déplacer la colonne">${colName}</h3>
            </div>
            <div class="column-header-right">
              <span class="column-task-count" aria-label="${col.tasks.length} tâche${col.tasks.length === 1 ? "" : "s"}">${col.tasks.length}</span>
              <div class="column-header-actions">
                <button type="button" class="icon-btn column-edit-btn" draggable="false" data-column-id="${colId}" aria-label="Modifier la colonne ${colName}">✎</button>
                <button type="button" class="icon-btn icon-btn--danger column-delete-btn" draggable="false" data-column-id="${colId}" aria-label="Supprimer la colonne ${colName}">🗑</button>
              </div>
            </div>
          </div>
        </header>
        <div class="tasks" data-drop-column="${colId}" role="list">
          ${tasksHtml}
        </div>
        <button type="button" class="tf-btn tf-btn--ghost tf-btn--sm add-task" data-column-id="${colId}">+ Ajouter une tâche</button>
      </section>`;
    })
    .join("");

  const addColumnHtml = `
    <section class="kanban-column kanban-column--add" aria-label="Ajouter une colonne">
      <button type="button" class="tf-btn tf-btn--primary tf-btn--sm add-column-btn" data-board-id="${escapeHtml(boardId)}">+ Nouvelle colonne</button>
    </section>`;

  board.innerHTML = columnsHtml + addColumnHtml;

  initDragAndDrop();

  columns.forEach((col) => {
    col.tasks.forEach((t) => {
      const el = [...board.querySelectorAll(".task[data-task-id]")].find(
        (node) => node.dataset.taskId === t.id,
      );
      if (el) wireTaskCard(el, t);
    });
  });

  board.querySelectorAll(".add-task").forEach((btn) => {
    btn.addEventListener("click", () => {
      const columnId = btn.dataset.columnId;
      if (!columnId) return;
      openTaskModal({
        onSave: async (payload) => {
          await apiFetch(`/api/columns/${columnId}/tasks`, {
            method: "POST",
            body: JSON.stringify(payload),
          });
          await reloadActiveBoard();
        },
      });
    });
  });

  board.querySelectorAll(".task-complete-toggle").forEach((input) => {
    input.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    input.addEventListener("change", () => {
      const taskId = input.dataset.taskId;
      if (!taskId) return;
      const card = input.closest(".task");
      const isDone = input.checked;
      setTaskDone(taskId, isDone);
      if (card) {
        card.classList.toggle("task--done", isDone);
        card.classList.toggle("task--inprogress", !isDone);
      }
    });
  });

  board.querySelectorAll(".column-edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.columnId;
      if (!id) return;
      const col = columns.find((c) => c.id === id);
      if (!col) return;
      openColumnModal({
        column: col,
        onSave: async (payload) => {
          await apiFetch(`/api/columns/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          });
          await reloadActiveBoard();
        },
      });
    });
  });

  board.querySelectorAll(".column-delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const id = btn.dataset.columnId;
      if (!id) return;
      if (
        !window.confirm(
          "Supprimer cette colonne et toutes ses tâches ? Cette action est définitive.",
        )
      ) {
        return;
      }
      try {
        await apiFetch(`/api/columns/${id}`, { method: "DELETE" });
        await reloadActiveBoard();
      } catch {
        await reloadActiveBoard();
      }
    });
  });

  const addColBtn = board.querySelector(".add-column-btn");
  if (addColBtn && boardId) {
    addColBtn.addEventListener("click", () => {
      openColumnModal({
        column: null,
        onSave: async (payload) => {
          await apiFetch(`/api/boards/${boardId}/columns`, {
            method: "POST",
            body: JSON.stringify(payload),
          });
          await reloadActiveBoard();
        },
      });
    });
  }
}

/** AJOUTER LA CARTE */
function insertTaskCardAtPointer(zone, card, clientY) {
  const siblings = [...zone.querySelectorAll(".task")].filter((el) => el !== card);
  let insertBefore = null;
  for (const el of siblings) {
    const rect = el.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    if (clientY < mid) {
      insertBefore = el;
      break;
    }
  }
  if (insertBefore) {
    zone.insertBefore(card, insertBefore);
  } else {
    zone.appendChild(card);
  }
}

/** Position 1-based de la carte parmi les .task du conteneur. */
function taskDropPosition1Based(zone, card) {
  const tasks = [...zone.children].filter(
    (el) => el.classList && el.classList.contains("task"),
  );
  const i = tasks.indexOf(card);
  return i >= 0 ? i + 1 : Math.max(1, tasks.length);
}

function clearAllDropHighlights() {
  document.querySelectorAll("[data-drop-column].drop-hover").forEach((z) => {
    z.classList.remove("drop-hover");
  });
  document.querySelectorAll("#kanbanBoard .kanban-column.column-drop-hover").forEach((el) => {
    el.classList.remove("column-drop-hover");
  });
}

function dataColumnSections(board) {
  return [...board.querySelectorAll(".kanban-column:not(.kanban-column--add)")];
}

/** DEPLACER LA COLONNE */
function insertColumnAtPointer(board, dragged, clientX) {
  const siblings = dataColumnSections(board).filter((el) => el !== dragged);
  let insertBefore = null;
  for (const el of siblings) {
    const rect = el.getBoundingClientRect();
    const mid = rect.left + rect.width / 2;
    if (clientX < mid) {
      insertBefore = el;
      break;
    }
  }
  const addCol = board.querySelector(".kanban-column--add");
  if (insertBefore) {
    board.insertBefore(dragged, insertBefore);
  } else if (addCol) {
    board.insertBefore(dragged, addCol);
  } else {
    board.appendChild(dragged);
  }
}

function columnDropPosition1Based(board, section) {
  const cols = dataColumnSections(board);
  const i = cols.indexOf(section);
  return i >= 0 ? i + 1 : Math.max(1, cols.length);
}

function autoScrollBoardOnDragOver(board, clientX) {
  const rect = board.getBoundingClientRect();
  const edgeThreshold = 72;
  const maxStep = 22;
  let delta = 0;

  if (clientX < rect.left + edgeThreshold) {
    const ratio = (rect.left + edgeThreshold - clientX) / edgeThreshold;
    delta = -Math.ceil(maxStep * Math.min(1, Math.max(0, ratio)));
  } else if (clientX > rect.right - edgeThreshold) {
    const ratio = (clientX - (rect.right - edgeThreshold)) / edgeThreshold;
    delta = Math.ceil(maxStep * Math.min(1, Math.max(0, ratio)));
  }

  if (delta !== 0) {
    board.scrollLeft += delta;
  }
}

export function initDragAndDrop() {
  let currentTaskId = null;
  let draggingEl = null;
  let draggingColumnSection = null;
  let currentColumnId = null;
  /** @type {string | null} */
  let dragTaskSourceColumnId = null;
  /** @type {number | null} */
  let dragTaskSourcePosition = null;

  document.querySelectorAll(".task").forEach((task) => {
    task.addEventListener("dragstart", (e) => {
      currentTaskId = task.dataset.taskId ?? null;
      draggingEl = task;
      task.classList.add("is-dragging");
      const srcZone = task.closest(".tasks");
      if (srcZone?.dataset.dropColumn) {
        dragTaskSourceColumnId = srcZone.dataset.dropColumn;
        dragTaskSourcePosition = taskDropPosition1Based(srcZone, task);
      } else {
        dragTaskSourceColumnId = null;
        dragTaskSourcePosition = null;
      }
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", currentTaskId ?? "");
      }
    });
    task.addEventListener("dragend", () => {
      task.classList.remove("is-dragging");
      clearAllDropHighlights();
      draggingEl = null;
      currentTaskId = null;
      dragTaskSourceColumnId = null;
      dragTaskSourcePosition = null;
    });
  });

  const board = document.getElementById("kanbanBoard");
  if (!board) {
    return;
  }

  board.querySelectorAll(".column-drag-handle").forEach((handle) => {
    // DEPLACER LA COLONNE
    handle.addEventListener("dragstart", (e) => {
      const section = handle.closest(".kanban-column");
      if (!section) {
        return;
      }
      draggingColumnSection = section;
      currentColumnId = section.dataset.columnId ?? null;
      section.classList.add("is-column-dragging");
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", currentColumnId ? `column:${currentColumnId}` : "");
      }
    });
    handle.addEventListener("dragend", () => {
      const section = handle.closest(".kanban-column");
      if (section) {
        section.classList.remove("is-column-dragging");
      }
      clearAllDropHighlights();
      draggingColumnSection = null;
      currentColumnId = null;
    });
  });

  board.addEventListener("dragover", (e) => {
    autoScrollBoardOnDragOver(board, e.clientX);

    if (draggingColumnSection && currentColumnId) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      insertColumnAtPointer(board, draggingColumnSection, e.clientX);
      const cols = dataColumnSections(board);
      let hoverCol = null;
      for (const el of cols) {
        if (el === draggingColumnSection) {
          continue;
        }
        const r = el.getBoundingClientRect();
        if (
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom
        ) {
          hoverCol = el;
          break;
        }
      }
      cols.forEach((c) => c.classList.remove("column-drop-hover"));
      if (hoverCol) {
        hoverCol.classList.add("column-drop-hover");
      }
      return;
    }

    const zone = e.target.closest("[data-drop-column]");
    if (!zone || !draggingEl || !currentTaskId) {
      return;
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    board.querySelectorAll("[data-drop-column].drop-hover").forEach((z) => {
      if (z !== zone) {
        z.classList.remove("drop-hover");
      }
    });
    zone.classList.add("drop-hover");
    insertTaskCardAtPointer(zone, draggingEl, e.clientY);
  });

  board.addEventListener("dragleave", (e) => {
    const related = e.relatedTarget;
    if (related && board.contains(related)) {
      return;
    }
    clearAllDropHighlights();
  });

  board.addEventListener("drop", async (e) => {
    if (draggingColumnSection && currentColumnId) {
      e.preventDefault();
      clearAllDropHighlights();
      insertColumnAtPointer(board, draggingColumnSection, e.clientX);
      const position = columnDropPosition1Based(board, draggingColumnSection);
      try {
        // DEPLACER LA COLONNE
        await apiFetch(`/api/columns/${currentColumnId}/move`, {
          method: "PATCH",
          body: JSON.stringify({ position }),
        });
        await fetchBoardData(boardSelectValue());
      } catch {
        await reloadActiveBoard();
      }
      return;
    }

    const zone = e.target.closest("[data-drop-column]");
    if (!zone || !currentTaskId || !draggingEl) {
      return;
    }
    e.preventDefault();
    zone.classList.remove("drop-hover");

    const newColumnId = zone.dataset.dropColumn;
    if (!newColumnId) {
      return;
    }

    insertTaskCardAtPointer(zone, draggingEl, e.clientY);
    const position = taskDropPosition1Based(zone, draggingEl);

    const srcCol = dragTaskSourceColumnId;
    const srcPos = dragTaskSourcePosition;
    try {
      // DEPLACER LA CARTE
      await apiFetch(`/api/tasks/${currentTaskId}/move`, {
        method: "PATCH",
        body: JSON.stringify({
          column_id: newColumnId,
          position,
        }),
      });
      await fetchBoardData(boardSelectValue());
      if (
        srcCol &&
        srcPos != null &&
        currentTaskId &&
        (srcCol !== newColumnId || srcPos !== position)
      ) {
        pushMoveSnapshot({
          taskId: currentTaskId,
          columnId: srcCol,
          position: srcPos,
        });
      }
    } catch {
      await reloadActiveBoard();
    }
  });
}
