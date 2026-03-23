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
    <div class="tf-modal-backdrop" aria-hidden="true"></div>
    <div class="tf-modal-panel tf-modal-panel--wide">
      <div class="tf-modal-content" role="dialog" aria-modal="true" aria-labelledby="accountModalTitle">
        <div class="tf-modal-header">
          <h3 id="accountModalTitle">Mon compte</h3>
          <button type="button" class="tf-modal-close" id="accountModalDismiss" aria-label="Fermer">×</button>
        </div>
        <div class="tf-modal-body">
          <dl class="account-dl">
            <dt>Nom</dt><dd>${name}</dd>
            <dt>E-mail</dt><dd>${email}</dd>
            <dt>Compte créé</dt><dd>${created}</dd>
            <dt>Dernière connexion</dt><dd>${lastLogin}</dd>
          </dl>
          <p class="account-hint">Les données proviennent du serveur lorsque la session est valide.</p>
          <div class="account-password account-password-block" aria-labelledby="accountPasswordTitle">
            <h4 id="accountPasswordTitle" class="account-password-title">Changer le mot de passe</h4>
            <div id="accountPasswordError" class="tf-alert tf-alert--danger" hidden role="alert"></div>
            <div class="tf-modal-field">
              <label class="tf-label" for="accountCurrentPassword" style="text-transform:none;letter-spacing:0;font-size:0.8125rem;font-weight:600">Mot de passe actuel</label>
              <input id="accountCurrentPassword" class="tf-input" type="password" autocomplete="current-password" minlength="8" />
            </div>
            <div class="tf-modal-field">
              <label class="tf-label" for="accountNewPassword" style="text-transform:none;letter-spacing:0;font-size:0.8125rem;font-weight:600">Nouveau mot de passe</label>
              <input id="accountNewPassword" class="tf-input" type="password" autocomplete="new-password" minlength="8" />
            </div>
            <div class="tf-modal-field">
              <label class="tf-label" for="accountNewPasswordConfirm" style="text-transform:none;letter-spacing:0;font-size:0.8125rem;font-weight:600">Confirmer le nouveau mot de passe</label>
              <input id="accountNewPasswordConfirm" class="tf-input" type="password" autocomplete="new-password" minlength="8" />
            </div>
            <div class="account-password-actions">
              <button type="button" id="accountPasswordSubmit" class="tf-btn tf-btn--primary">Mettre à jour le mot de passe</button>
            </div>
          </div>
          <div class="tf-modal-actions">
            <button type="button" id="closeAccountBtn" class="tf-btn tf-btn--ghost">Fermer</button>
          </div>
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

  modal.querySelector(".tf-modal-backdrop")?.addEventListener("click", close);
  document.getElementById("closeAccountBtn")?.addEventListener("click", close);
  document.getElementById("accountModalDismiss")?.addEventListener("click", close);

  const pwdErr = document.getElementById("accountPasswordError");
  const setPwdErr = (msg = "") => {
    if (!pwdErr) return;
    pwdErr.textContent = msg;
    pwdErr.hidden = !msg;
  };

  document.getElementById("accountPasswordSubmit")?.addEventListener("click", async () => {
    setPwdErr("");
    const cur = document.getElementById("accountCurrentPassword");
    const neu = document.getElementById("accountNewPassword");
    const conf = document.getElementById("accountNewPasswordConfirm");
    if (!cur || !neu || !conf) return;
    const current_password = cur.value;
    const new_password = neu.value;
    const c2 = conf.value;
    if (current_password.length < 8) {
      setPwdErr("Le mot de passe actuel doit contenir au moins 8 caractères.");
      cur.focus();
      return;
    }
    if (new_password.length < 8) {
      setPwdErr("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      neu.focus();
      return;
    }
    if (new_password !== c2) {
      setPwdErr("La confirmation ne correspond pas au nouveau mot de passe.");
      conf.focus();
      return;
    }
    try {
      await apiFetch("/api/auth/password", {
        method: "PATCH",
        body: JSON.stringify({ current_password, new_password }),
      });
      cur.value = "";
      neu.value = "";
      conf.value = "";
      setPwdErr("");
      const ok = document.createElement("p");
      ok.className = "account-password-success";
      ok.setAttribute("role", "status");
      ok.textContent = "Mot de passe mis à jour.";
      const box = modal.querySelector(".account-password");
      const old = box?.querySelector(".account-password-success");
      old?.remove();
      box?.appendChild(ok);
      setTimeout(() => ok.remove(), 4000);
    } catch (e) {
      setPwdErr(
        e instanceof Error ? e.message : "Impossible de mettre à jour le mot de passe.",
      );
    }
  });

  requestAnimationFrame(() => document.getElementById("closeAccountBtn")?.focus());
}

export function closeAccountModal() {
  const modal = document.getElementById("accountModal");
  if (!modal) return;
  modal.hidden = true;
  modal.innerHTML = "";
}
