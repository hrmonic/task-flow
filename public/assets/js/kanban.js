import { apiFetch } from "./api.js";
import { openColumnModal } from "./columnModal.js";
import { escapeHtml, taskPriorityClass } from "./escape.js";
import { openTaskModal } from "./taskModal.js";

function boardSelectValue() {
  const sel = document.getElementById("boardSelect");
  return sel ? sel.value : "";
}

export async function reloadActiveBoard() {
  await loadBoard(boardSelectValue());
}

export async function loadBoard(boardId) {
  if (!boardId) return;
  const board = document.getElementById("kanbanBoard");
  if (board) board.setAttribute("aria-busy", "true");
  try {
    const columns = await apiFetch(`/api/boards/${boardId}/columns`);
    const withTasks = await Promise.all(
      columns.map(async (col) => ({
        ...col,
        tasks: await apiFetch(`/api/columns/${col.id}/tasks`),
      })),
    );
    renderBoard(withTasks);
  } finally {
    if (board) board.setAttribute("aria-busy", "false");
  }
}

function wireTaskCard(taskEl, task) {
  const openEditor = () => {
    openTaskModal({
      task,
      onSave: async (payload) => {
        await apiFetch(`/api/tasks/${task.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        await reloadActiveBoard();
      },
      onDelete: async (taskId) => {
        await apiFetch(`/api/tasks/${taskId}`, { method: "DELETE" });
        await reloadActiveBoard();
      },
    });
  };

  taskEl.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) return;
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
  const boardId = boardSelectValue();
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
          return `<article class="task priority-${pr}" draggable="true" data-task-id="${taskId}" tabindex="0" role="listitem" aria-label="Tâche : ${title}. Appuyez sur Entrée pour modifier.">
                <h4>${title}</h4>${desc ? `<p>${desc}</p>` : ""}
              </article>`;
        })
        .join("");
          return `
      <section class="kanban-column" data-column-id="${colId}" aria-label="Colonne ${colName}" style="--column-accent:${colColor}">
        <header class="column-header">
          <div class="column-header-row">
            <h3 class="column-drag-handle" draggable="true" title="Glisser pour déplacer la colonne">${colName}</h3>
            <div class="column-header-actions">
              <button type="button" class="icon-btn column-edit-btn" draggable="false" data-column-id="${colId}" aria-label="Modifier la colonne ${colName}">✎</button>
              <button type="button" class="icon-btn icon-btn--danger column-delete-btn" draggable="false" data-column-id="${colId}" aria-label="Supprimer la colonne ${colName}">🗑</button>
            </div>
          </div>
          <span class="column-task-count" aria-label="${col.tasks.length} tâche${col.tasks.length === 1 ? "" : "s"}">${col.tasks.length}</span>
        </header>
        <div class="tasks" data-drop-column="${colId}" role="list">
          ${tasksHtml}
        </div>
        <button type="button" class="btn add-task" data-column-id="${colId}">+ Ajouter une tâche</button>
      </section>`;
    })
    .join("");

  const addColumnHtml = `
    <section class="kanban-column kanban-column--add" aria-label="Ajouter une colonne">
      <button type="button" class="btn secondary add-column-btn" data-board-id="${escapeHtml(boardId)}">+ Nouvelle colonne</button>
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

/** Insère la carte au bon index selon la position verticale du pointeur. */
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

export function initDragAndDrop() {
  let currentTaskId = null;
  let draggingEl = null;
  let draggingColumnSection = null;
  let currentColumnId = null;

  document.querySelectorAll(".task").forEach((task) => {
    task.addEventListener("dragstart", (e) => {
      currentTaskId = task.dataset.taskId ?? null;
      draggingEl = task;
      task.classList.add("is-dragging");
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
    });
  });

  const board = document.getElementById("kanbanBoard");
  if (!board) {
    return;
  }

  board.querySelectorAll(".column-drag-handle").forEach((handle) => {
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
        await apiFetch(`/api/columns/${currentColumnId}/move`, {
          method: "PATCH",
          body: JSON.stringify({ position }),
        });
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

    try {
      await apiFetch(`/api/tasks/${currentTaskId}/move`, {
        method: "PATCH",
        body: JSON.stringify({
          column_id: newColumnId,
          position,
        }),
      });
    } catch {
      await reloadActiveBoard();
    }
  });
}
