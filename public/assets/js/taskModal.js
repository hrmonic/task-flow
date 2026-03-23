const PRIORITY_LABELS = {
  low: "Basse",
  medium: "Normale",
  high: "Haute",
  urgent: "Urgente",
};

function priorityOptionsHtml(selected) {
  return ["low", "medium", "high", "urgent"]
    .map((p) => {
      const sel = p === selected ? " selected" : "";
      return `<option value="${p}"${sel}>${PRIORITY_LABELS[p]}</option>`;
    })
    .join("");
}

function trapFocus(dialogEl) {
  const focusables = dialogEl.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const list = [...focusables].filter(
    (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
  );
  if (list.length === 0) return () => {};
  const first = list[0];
  const last = list[list.length - 1];

  const onKeydown = (e) => {
    if (e.key !== "Tab") return;
    if (list.length === 1) {
      e.preventDefault();
      return;
    }
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  dialogEl.addEventListener("keydown", onKeydown);
  return () => dialogEl.removeEventListener("keydown", onKeydown);
}

/**
 * @param {object} options
 * @param {object | null} [options.task]
 * @param {(payload: object) => void | Promise<void>} options.onSave
 * @param {(taskId: string) => void | Promise<void>} [options.onDelete]
 */
export function openTaskModal({ task = null, onSave, onDelete }) {
  const modal = document.getElementById("taskModal");
  if (!modal || typeof onSave !== "function") return;

  const previousFocus =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
  const isEdit = Boolean(task?.id);

  modal.hidden = false;
  modal.innerHTML = `
    <div class="tf-modal-backdrop" aria-hidden="true"></div>
    <div class="tf-modal-panel">
      <div class="tf-modal-content" role="dialog" aria-modal="true" aria-labelledby="taskModalTitle">
        <div class="tf-modal-header">
          <h3 id="taskModalTitle">${isEdit ? "Modifier la tâche" : "Nouvelle tâche"}</h3>
          <button type="button" class="tf-modal-close" id="taskModalDismiss" aria-label="Fermer">×</button>
        </div>
        <div class="tf-modal-body">
          <div class="tf-modal-field">
            <label class="tf-label" for="taskTitle" style="text-transform:none;letter-spacing:0;font-size:0.8125rem;font-weight:600">Titre</label>
            <input id="taskTitle" class="tf-input" type="text" placeholder="Ex. Relire la documentation" maxlength="255" autocomplete="off" />
          </div>
          <div class="tf-modal-field">
            <label class="tf-label" for="taskDescription" style="text-transform:none;letter-spacing:0;font-size:0.8125rem;font-weight:600">Description</label>
            <textarea id="taskDescription" class="tf-textarea" rows="3" placeholder="Détails, liens, critères d’acceptation…"></textarea>
          </div>
          <div class="tf-modal-field">
            <label class="tf-label" for="taskPriority" style="text-transform:none;letter-spacing:0;font-size:0.8125rem;font-weight:600">Priorité</label>
            <select id="taskPriority" class="tf-select">${priorityOptionsHtml(task?.priority || "medium")}</select>
          </div>
          <div class="tf-modal-field">
            <label class="tf-label" for="taskDueDate" style="text-transform:none;letter-spacing:0;font-size:0.8125rem;font-weight:600">Échéance</label>
            <input id="taskDueDate" class="tf-input" type="date" />
          </div>
          <div class="tf-modal-actions">
            ${isEdit && typeof onDelete === "function" ? '<button type="button" id="deleteTaskBtn" class="tf-btn tf-btn--danger tf-btn--sm">Supprimer</button>' : ""}
            <button type="button" id="closeTaskBtn" class="tf-btn tf-btn--ghost">Annuler</button>
            <button type="button" id="saveTaskBtn" class="tf-btn tf-btn--primary">${isEdit ? "Enregistrer" : "Créer"}</button>
          </div>
        </div>
      </div>
    </div>`;

  const backdrop = modal.querySelector(".tf-modal-backdrop");
  const dialog = modal.querySelector('[role="dialog"]');
  const titleInput = document.getElementById("taskTitle");
  const descInput = document.getElementById("taskDescription");
  const prioritySelect = document.getElementById("taskPriority");
  const dueInput = document.getElementById("taskDueDate");

  if (titleInput) titleInput.value = task?.title ? String(task.title) : "";
  if (descInput)
    descInput.value = task?.description ? String(task.description) : "";
  if (prioritySelect) {
    const p =
      task?.priority && PRIORITY_LABELS[task.priority]
        ? task.priority
        : "medium";
    prioritySelect.value = p;
  }
  if (dueInput && task?.due_date)
    dueInput.value = String(task.due_date).slice(0, 10);

  const releaseFocusTrap = dialog instanceof HTMLElement ? trapFocus(dialog) : () => {};

  const close = () => {
    document.removeEventListener("keydown", onDocumentKeydown);
    releaseFocusTrap();
    closeTaskModal();
    previousFocus?.focus?.();
  };

  const onDocumentKeydown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  document.addEventListener("keydown", onDocumentKeydown);

  const closeBtn = document.getElementById("closeTaskBtn");
  const dismissBtn = document.getElementById("taskModalDismiss");
  const saveBtn = document.getElementById("saveTaskBtn");
  const deleteBtn = document.getElementById("deleteTaskBtn");

  if (backdrop) {
    backdrop.addEventListener("click", close);
  }
  if (closeBtn) closeBtn.onclick = () => close();
  if (dismissBtn) dismissBtn.onclick = () => close();

  if (saveBtn) {
    saveBtn.onclick = async () => {
      const titleEl = document.getElementById("taskTitle");
      const descEl = document.getElementById("taskDescription");
      const priEl = document.getElementById("taskPriority");
      const dueEl = document.getElementById("taskDueDate");
      if (!titleEl) return;
      const title = titleEl.value.trim();
      if (!title) {
        titleEl.focus();
        return;
      }
      try {
        await onSave({
          title,
          description: descEl ? descEl.value.trim() : "",
          priority: priEl ? priEl.value : "medium",
          due_date: dueEl && dueEl.value ? dueEl.value : null,
        });
        close();
      } catch {
        /* Laisser la modale ouverte ; l’appelant peut afficher une erreur. */
      }
    };
  }

  if (deleteBtn && isEdit && task?.id && typeof onDelete === "function") {
    deleteBtn.onclick = async () => {
      if (
        !window.confirm("Supprimer cette tâche ? Cette action est définitive.")
      )
        return;
      try {
        await onDelete(String(task.id));
        close();
      } catch {
        /* idem */
      }
    };
  }

  requestAnimationFrame(() => {
    if (titleInput) titleInput.focus();
    else if (saveBtn) saveBtn.focus();
  });
}

export function closeTaskModal() {
  const modal = document.getElementById("taskModal");
  if (!modal) return;
  modal.hidden = true;
  modal.innerHTML = "";
}
