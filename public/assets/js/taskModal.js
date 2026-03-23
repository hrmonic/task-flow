export function openTaskModal({ task = null, onSave }) {
  const modal = document.getElementById("taskModal");
  if (!modal || typeof onSave !== "function") return;

  modal.hidden = false;
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${task ? "Edit Task" : "New Task"}</h3>
      <input id="taskTitle" placeholder="Title" />
      <textarea id="taskDescription" placeholder="Description"></textarea>
      <select id="taskPriority">
        ${["low", "medium", "high", "urgent"]
          .map((p) => `<option value="${p}">${p}</option>`)
          .join("")}
      </select>
      <input id="taskDueDate" type="date" />
      <div class="modal-actions">
        <button type="button" id="saveTaskBtn" class="btn">Save</button>
        <button type="button" id="closeTaskBtn" class="btn secondary">Cancel</button>
      </div>
    </div>`;

  const titleInput = document.getElementById("taskTitle");
  const descInput = document.getElementById("taskDescription");
  const prioritySelect = document.getElementById("taskPriority");
  const dueInput = document.getElementById("taskDueDate");
  if (titleInput) titleInput.value = task?.title ? String(task.title) : "";
  if (descInput) descInput.value = task?.description ? String(task.description) : "";
  if (prioritySelect && task?.priority) prioritySelect.value = task.priority;
  if (dueInput && task?.due_date) dueInput.value = String(task.due_date).slice(0, 10);

  const closeBtn = document.getElementById("closeTaskBtn");
  const saveBtn = document.getElementById("saveTaskBtn");
  if (closeBtn) closeBtn.onclick = () => closeTaskModal();
  if (saveBtn) {
    saveBtn.onclick = () => {
      const titleEl = document.getElementById("taskTitle");
      const descEl = document.getElementById("taskDescription");
      const priEl = document.getElementById("taskPriority");
      const dueEl = document.getElementById("taskDueDate");
      if (!titleEl) return;
      const title = titleEl.value.trim();
      if (!title) return;
      onSave({
        title,
        description: descEl ? descEl.value.trim() : "",
        priority: priEl ? priEl.value : "medium",
        due_date: dueEl && dueEl.value ? dueEl.value : null,
      });
      closeTaskModal();
    };
  }
}

export function closeTaskModal() {
  const modal = document.getElementById("taskModal");
  if (!modal) return;
  modal.hidden = true;
  modal.innerHTML = "";
}
