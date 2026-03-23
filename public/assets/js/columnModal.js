import { escapeHtml } from "./escape.js";

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
 * @param {object | null} [options.column]
 * @param {(payload: object) => void | Promise<void>} options.onSave
 */
export function openColumnModal({ column = null, onSave }) {
  const modal = document.getElementById("columnModal");
  if (!modal || typeof onSave !== "function") return;

  const previousFocus =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
  const isEdit = Boolean(column?.id);
  const defaultColor = /^#[0-9A-Fa-f]{6}$/.test(column?.color || "")
    ? column.color
    : "#64748b";

  modal.hidden = false;
  modal.innerHTML = `
    <div class="tf-modal-backdrop" aria-hidden="true"></div>
    <div class="tf-modal-panel">
      <div class="tf-modal-content" role="dialog" aria-modal="true" aria-labelledby="columnModalTitle">
        <div class="tf-modal-header">
          <h3 id="columnModalTitle">${isEdit ? "Modifier la colonne" : "Nouvelle colonne"}</h3>
          <button type="button" class="tf-modal-close" id="columnModalDismiss" aria-label="Fermer">×</button>
        </div>
        <div class="tf-modal-body">
          <div class="tf-modal-field">
            <label class="form-label" for="columnName">Nom</label>
            <input id="columnName" class="form-control" type="text" maxlength="120" autocomplete="off" />
          </div>
          <div class="tf-modal-field">
            <label class="form-label" for="columnColor">Couleur (barre du haut)</label>
            <input id="columnColor" class="form-control form-control-color w-100" type="color" value="${escapeHtml(defaultColor)}" title="Couleur de la colonne" />
          </div>
          <div class="tf-modal-actions">
            <button type="button" id="closeColumnBtn" class="btn btn-outline-secondary">Annuler</button>
            <button type="button" id="saveColumnBtn" class="btn btn-primary">${isEdit ? "Enregistrer" : "Créer"}</button>
          </div>
        </div>
      </div>
    </div>`;

  const nameInput = document.getElementById("columnName");
  if (nameInput) nameInput.value = column?.name ? String(column.name) : "";

  const dialog = modal.querySelector('[role="dialog"]');
  const releaseFocusTrap =
    dialog instanceof HTMLElement ? trapFocus(dialog) : () => {};

  const close = () => {
    document.removeEventListener("keydown", onDocumentKeydown);
    releaseFocusTrap();
    closeColumnModal();
    previousFocus?.focus?.();
  };

  const onDocumentKeydown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };
  document.addEventListener("keydown", onDocumentKeydown);

  modal.querySelector(".tf-modal-backdrop")?.addEventListener("click", close);
  document.getElementById("closeColumnBtn")?.addEventListener("click", close);
  document.getElementById("columnModalDismiss")?.addEventListener("click", close);

  document.getElementById("saveColumnBtn")?.addEventListener("click", async () => {
    const nameEl = document.getElementById("columnName");
    const colorEl = document.getElementById("columnColor");
    if (!nameEl) return;
    const name = nameEl.value.trim();
    if (name.length < 2) {
      nameEl.focus();
      return;
    }
    const color = colorEl?.value || "#64748b";
    try {
      await onSave({ name, color });
      close();
    } catch {
      /* laisser ouvert */
    }
  });

  requestAnimationFrame(() => nameInput?.focus());
}

export function closeColumnModal() {
  const modal = document.getElementById("columnModal");
  if (!modal) return;
  modal.hidden = true;
  modal.innerHTML = "";
}
