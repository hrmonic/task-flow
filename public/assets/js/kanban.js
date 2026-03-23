import { apiFetch } from "./api.js";
import { escapeHtml, taskPriorityClass } from "./escape.js";
import { openTaskModal } from "./taskModal.js";

export async function loadBoard(boardId) {
  if (!boardId) return;
  const columns = await apiFetch(`/api/boards/${boardId}/columns`);
  const withTasks = await Promise.all(
    columns.map(async (col) => ({ ...col, tasks: await apiFetch(`/api/columns/${col.id}/tasks`) }))
  );
  renderBoard(withTasks);
}

export function renderBoard(columns) {
  const board = document.getElementById("kanbanBoard");
  board.innerHTML = columns
    .map((col) => {
      const colId = escapeHtml(col.id);
      const colName = escapeHtml(col.name);
      const tasksHtml = col.tasks
        .map((t) => {
          const pr = taskPriorityClass(t.priority);
          return `<article class="task priority-${pr}" draggable="true" data-task-id="${escapeHtml(t.id)}">
                <h4>${escapeHtml(t.title)}</h4><p>${escapeHtml(t.description || "")}</p>
              </article>`;
        })
        .join("");
      return `
      <section class="kanban-column" data-column-id="${colId}">
        <header>
          <h3>${colName}</h3>
          <span>${col.tasks.length}</span>
        </header>
        <div class="tasks" data-drop-column="${colId}">
          ${tasksHtml}
        </div>
        <button type="button" class="btn add-task" data-column-id="${colId}">+ Add task</button>
      </section>`;
    })
    .join("");

  initDragAndDrop();
  board.querySelectorAll(".add-task").forEach((btn) => {
    btn.addEventListener("click", () => {
      const columnId = btn.dataset.columnId;
      if (!columnId) return;
      openTaskModal({
        onSave: async (payload) => {
          await apiFetch(`/api/columns/${columnId}/tasks`, { method: "POST", body: JSON.stringify(payload) });
          const sel = document.getElementById("boardSelect");
          await loadBoard(sel ? sel.value : "");
        },
      });
    });
  });
}

export function initDragAndDrop() {
  let currentTaskId = null;
  document.querySelectorAll(".task").forEach((task) => {
    task.addEventListener("dragstart", () => {
      currentTaskId = task.dataset.taskId;
    });
  });
  document.querySelectorAll("[data-drop-column]").forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("drop-hover");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("drop-hover"));
    zone.addEventListener("drop", async (e) => {
      e.preventDefault();
      zone.classList.remove("drop-hover");
      if (!currentTaskId) return;
      const newColumnId = zone.dataset.dropColumn;
      if (!newColumnId) {
        currentTaskId = null;
        return;
      }
      let optimisticCard = null;
      document.querySelectorAll("[data-task-id]").forEach((el) => {
        if (el.dataset.taskId === currentTaskId) optimisticCard = el;
      });
      const oldParent = optimisticCard?.parentElement;
      if (optimisticCard) zone.appendChild(optimisticCard);
      try {
        await apiFetch(`/api/tasks/${currentTaskId}/move`, {
          method: "PATCH",
          body: JSON.stringify({ column_id: newColumnId, position: zone.children.length }),
        });
      } catch (err) {
        if (optimisticCard && oldParent) oldParent.appendChild(optimisticCard);
      }
      currentTaskId = null;
    });
  });
}
