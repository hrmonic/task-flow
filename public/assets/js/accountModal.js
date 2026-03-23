import { apiFetch } from "./api.js";
import { getSessionUser, setSessionUser } from "./auth.js";
import { escapeHtml } from "./escape.js";

function formatFrDate(iso) {
  if (!iso || typeof iso !== "string") return "—";
  const d = new Date(iso.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
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

export async function openAccountModal() {
  const modal = document.getElementById("accountModal");
  if (!modal) return;

  let profile;
  try {
    profile = await apiFetch("/api/auth/me");
    if (profile?.name) {
      setSessionUser({
        name: profile.name,
        email: typeof profile.email === "string" ? profile.email : "",
      });
    }
  } catch {
    profile = getSessionUser();
    if (profile) {
      profile = {
        name: profile.name,
        email: profile.email,
        created_at: "",
        last_login_at: null,
      };
    }
  }

  if (!profile) return;

  const name = escapeHtml(profile.name || "—");
  const email = escapeHtml(profile.email || "—");
  const created = escapeHtml(
    profile.created_at ? formatFrDate(profile.created_at) : "—",
  );
  const lastLogin = profile.last_login_at
    ? escapeHtml(formatFrDate(profile.last_login_at))
    : "—";

  const previousFocus =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

  modal.hidden = false;
  modal.innerHTML = `
    <div class="modal-backdrop" aria-hidden="true"></div>
    <div class="modal-panel">
      <div class="modal-content modal-content--account" role="dialog" aria-modal="true" aria-labelledby="accountModalTitle">
        <div class="modal-header">
          <h3 id="accountModalTitle">Mon compte</h3>
          <button type="button" class="modal-close" id="accountModalDismiss" aria-label="Fermer">×</button>
        </div>
        <dl class="account-dl">
          <dt>Nom</dt><dd>${name}</dd>
          <dt>E-mail</dt><dd>${email}</dd>
          <dt>Compte créé</dt><dd>${created}</dd>
          <dt>Dernière connexion</dt><dd>${lastLogin}</dd>
        </dl>
        <p class="account-hint">Les données proviennent du serveur lorsque la session est valide.</p>
        <div class="modal-actions">
          <button type="button" id="closeAccountBtn" class="btn secondary">Fermer</button>
        </div>
      </div>
    </div>`;

  const dialog = modal.querySelector('[role="dialog"]');
  const releaseFocusTrap =
    dialog instanceof HTMLElement ? trapFocus(dialog) : () => {};

  const close = () => {
    document.removeEventListener("keydown", onDocumentKeydown);
    releaseFocusTrap();
    closeAccountModal();
    previousFocus?.focus?.();
  };

  const onDocumentKeydown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };
  document.addEventListener("keydown", onDocumentKeydown);

  modal.querySelector(".modal-backdrop")?.addEventListener("click", close);
  document.getElementById("closeAccountBtn")?.addEventListener("click", close);
  document.getElementById("accountModalDismiss")?.addEventListener("click", close);

  requestAnimationFrame(() => document.getElementById("closeAccountBtn")?.focus());
}

export function closeAccountModal() {
  const modal = document.getElementById("accountModal");
  if (!modal) return;
  modal.hidden = true;
  modal.innerHTML = "";
}
