import { apiFetch } from "./api.js";
import { openTaskModal } from "./taskModal.js";

export async function loadBoard(boardId) {
  const columns = await apiFetch(`/api/boards/${boardId}/columns`);
  const withTasks = await Promise.all(
    columns.map(async (col) => ({ ...col, tasks: await apiFetch(`/api/columns/${col.id}/tasks`) }))
  );
  renderBoard(withTasks);
}

export function renderBoard(columns) {
  const board = document.getElementById("kanbanBoard");
  board.innerHTML = columns
    .map(
      (col) => `
      <section class="kanban-column" data-column-id="${col.id}">
        <header>
          <h3>${col.name}</h3>
          <span>${col.tasks.length}</span>
        </header>
        <div class="tasks" data-drop-column="${col.id}">
          ${col.tasks
            .map(
              (t) => `<article class="task priority-${t.priority}" draggable="true" data-task-id="${t.id}">
                <h4>${t.title}</h4><p>${t.description || ""}</p>
              </article>`
            )
            .join("")}
        </div>
        <button class="btn add-task" data-column-id="${col.id}">+ Add task</button>
      </section>`
    )
    .join("");

  initDragAndDrop();
  board.querySelectorAll(".add-task").forEach((btn) => {
    btn.addEventListener("click", () => openTaskModal({
      onSave: async (payload) => {
        await apiFetch(`/api/columns/${btn.dataset.columnId}/tasks`, { method: "POST", body: JSON.stringify(payload) });
        await loadBoard(document.getElementById("boardSelect").value);
      },
    }));
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
      const optimisticCard = document.querySelector(`[data-task-id="${currentTaskId}"]`);
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
