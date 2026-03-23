export function openTaskModal({ task = null, onSave }) {
  const modal = document.getElementById("taskModal");
  modal.classList.remove("hidden");
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${task ? "Edit Task" : "New Task"}</h3>
      <input id="taskTitle" placeholder="Title" value="${task?.title || ""}" />
      <textarea id="taskDescription" placeholder="Description">${task?.description || ""}</textarea>
      <select id="taskPriority">
        ${["low","medium","high","urgent"].map(p => `<option value="${p}" ${task?.priority===p?"selected":""}>${p}</option>`).join("")}
      </select>
      <input id="taskDueDate" type="date" value="${task?.due_date || ""}" />
      <div class="modal-actions">
        <button id="saveTaskBtn" class="btn">Save</button>
        <button id="closeTaskBtn" class="btn secondary">Cancel</button>
      </div>
    </div>`;

  document.getElementById("closeTaskBtn").onclick = () => closeTaskModal();
  document.getElementById("saveTaskBtn").onclick = () => {
    const title = document.getElementById("taskTitle").value.trim();
    if (!title) return;
    onSave({
      title,
      description: document.getElementById("taskDescription").value.trim(),
      priority: document.getElementById("taskPriority").value,
      due_date: document.getElementById("taskDueDate").value || null,
    });
    closeTaskModal();
  };
}

export function closeTaskModal() {
  const modal = document.getElementById("taskModal");
  modal.classList.add("hidden");
  modal.innerHTML = "";
}
