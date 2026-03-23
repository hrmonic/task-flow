import { openAccountModal } from "./accountModal.js";
import { apiFetch } from "./api.js";
import {
  login,
  register,
  logout,
  getToken,
  getSessionUser,
  refreshProfileFromApi,
} from "./auth.js";
import { loadBoard } from "./kanban.js";

const state = { boards: [], activeBoardId: null };

function setAuthenticatedShell(active) {
  document.body.classList.toggle("is-authenticated", active);
}

function refreshNavUser() {
  const el = document.getElementById("navUserLabel");
  if (!el) return;
  if (!getToken()) {
    el.hidden = true;
    el.textContent = "";
    return;
  }
  const u = getSessionUser();
  el.textContent = u?.name ? u.name : "Connecté";
  el.hidden = false;
}

function wireShellNavigation() {
  const nav = document.getElementById("navMain");
  const toggle = document.getElementById("navToggle");

  const scrollToTarget = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.hidden = false;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (id === "main-content") el.focus({ preventScroll: true });
    }
  };

  document.querySelectorAll("[data-nav-target]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = link.getAttribute("data-nav-target");
      if (!target) return;
      e.preventDefault();
      if (target === "main") scrollToTarget("main-content");
      else if (target === "auth") scrollToTarget("authSection");
      else if (target === "boards") scrollToTarget("boardSection");
      else if (target === "footer") scrollToTarget("page-footer");
      if (nav && toggle) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
}

function wireAccountModal() {
  document.getElementById("openAccountBtn")?.addEventListener("click", async () => {
    await openAccountModal();
    refreshNavUser();
    const nav = document.getElementById("navMain");
    const toggle = document.getElementById("navToggle");
    if (nav && toggle) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function syncBoardEditorFromState() {
  const select = document.getElementById("boardSelect");
  const titleIn = document.getElementById("boardTitleInput");
  const descIn = document.getElementById("boardDescInput");
  if (!select || !titleIn || !descIn) return;
  const id = select.value;
  const b = state.boards.find((x) => x.id === id);
  if (!b) return;
  titleIn.value = b.name || "";
  descIn.value = b.description ? String(b.description) : "";
}

function setBoardToolbarError(message = "") {
  const el = document.getElementById("boardToolbarError");
  if (!el) return;
  el.textContent = message;
  el.hidden = !message;
}

function fillBoardSelect(selectEl, boards) {
  if (!selectEl) return;
  selectEl.replaceChildren();
  boards.forEach((b) => {
    const opt = document.createElement("option");
    opt.value = b.id;
    opt.textContent = b.name;
    selectEl.appendChild(opt);
  });
}

function setAuthError(targetId, message = "") {
  const node = document.getElementById(targetId);
  if (!node) return;
  node.textContent = message;
  node.hidden = !message;
}

function wirePasswordRevealButtons(root) {
  root.querySelectorAll("[data-reveal-target]").forEach((btn) => {
    const id = btn.getAttribute("data-reveal-target");
    const input = id ? document.getElementById(id) : null;
    if (!input) return;
    btn.addEventListener("click", () => {
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.setAttribute("aria-pressed", String(!showing));
      btn.setAttribute(
        "aria-label",
        showing ? "Afficher le mot de passe" : "Masquer le mot de passe",
      );
      btn.textContent = showing ? "Voir" : "Masquer";
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showAuthMode(mode, options = {}) {
  const { initial = false } = options;
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  if (!loginForm || !registerForm || !tabLogin || !tabRegister) return;

  const isLogin = mode === "login";
  const wasLogin = tabLogin.getAttribute("aria-selected") === "true";
  if (!initial && wasLogin === isLogin) {
    return;
  }

  loginForm.hidden = !isLogin;
  registerForm.hidden = isLogin;
  loginForm.setAttribute("aria-hidden", String(!isLogin));
  registerForm.setAttribute("aria-hidden", String(isLogin));
  tabLogin.classList.toggle("is-active", isLogin);
  tabRegister.classList.toggle("is-active", !isLogin);
  tabLogin.setAttribute("aria-selected", String(isLogin));
  tabRegister.setAttribute("aria-selected", String(!isLogin));
  tabLogin.tabIndex = isLogin ? 0 : -1;
  tabRegister.tabIndex = isLogin ? -1 : 0;
  (isLogin
    ? document.getElementById("loginEmail")
    : document.getElementById("registerName")
  )?.focus();
}

function renderAuth() {
  const authSection = document.getElementById("authSection");
  if (!authSection) return;
  authSection.innerHTML = `
    <div class="auth-wrap">
      <section class="auth-shell" aria-labelledby="authTitle">
        <div class="auth-head">
          <p class="auth-kicker">Votre espace Kanban</p>
          <h1 id="authTitle">Bienvenue</h1>
          <p class="auth-subtitle">Connectez-vous pour reprendre vos tableaux, ou créez un compte en moins d'une minute.</p>
        </div>

        <div class="auth-switch" role="tablist" aria-label="Connexion ou inscription">
          <button id="tabLogin" type="button" class="auth-switch-btn is-active" role="tab" aria-selected="true" aria-controls="loginForm" tabindex="0">
            Connexion
          </button>
          <button id="tabRegister" type="button" class="auth-switch-btn" role="tab" aria-selected="false" aria-controls="registerForm" tabindex="-1">
            Inscription
          </button>
        </div>

        <form id="loginForm" class="auth-card" role="tabpanel" aria-labelledby="tabLogin" novalidate>
          <div class="auth-card-surface">
            <h3 class="auth-form-title" id="loginFormHeading">Connexion</h3>
            <div id="loginError" class="auth-error" hidden role="alert" aria-live="assertive"></div>

            <div class="auth-fields-frame">
              <fieldset class="auth-fields-group">
                <legend>Identifiants</legend>
                <div class="auth-field">
                  <label for="loginEmail">Adresse e-mail</label>
                  <input id="loginEmail" name="email" type="email" placeholder="vous@entreprise.com" autocomplete="email" inputmode="email" required>
                </div>

                <div class="auth-field">
                  <label for="loginPassword">Mot de passe</label>
                  <div class="auth-input-row">
                    <input id="loginPassword" name="password" type="password" placeholder="Votre mot de passe" autocomplete="current-password" minlength="8" required>
                    <button type="button" class="auth-reveal-btn" data-reveal-target="loginPassword" aria-controls="loginPassword" aria-pressed="false" aria-label="Afficher le mot de passe">Voir</button>
                  </div>
                </div>
              </fieldset>
            </div>

            <button id="loginBtn" type="submit" class="btn auth-primary auth-card-submit">Se connecter</button>
            <p class="auth-footnote">Pas encore de compte ? <button id="goToRegisterBtn" type="button" class="auth-inline-link">Créer un compte</button></p>
          </div>
        </form>

        <form id="registerForm" class="auth-card" role="tabpanel" aria-labelledby="tabRegister" hidden novalidate aria-hidden="true">
          <div class="auth-card-surface">
            <h3 class="auth-form-title" id="registerFormHeading">Inscription</h3>
            <div id="registerError" class="auth-error" hidden role="alert" aria-live="assertive"></div>

            <div class="auth-fields-frame">
              <fieldset class="auth-fields-group">
                <legend>Nouveau compte</legend>
                <div class="auth-field">
                  <label for="registerName">Nom complet</label>
                  <input id="registerName" name="name" type="text" placeholder="Jean Dupont" autocomplete="name" minlength="2" required>
                </div>

                <div class="auth-field">
                  <label for="registerEmail">Adresse e-mail</label>
                  <input id="registerEmail" name="email" type="email" placeholder="vous@entreprise.com" autocomplete="email" inputmode="email" required>
                </div>

                <div class="auth-field">
                  <label for="registerPassword">Mot de passe</label>
                  <div class="auth-input-row">
                    <input id="registerPassword" name="password" type="password" placeholder="Au moins 8 caractères" autocomplete="new-password" minlength="8" required>
                    <button type="button" class="auth-reveal-btn" data-reveal-target="registerPassword" aria-controls="registerPassword" aria-pressed="false" aria-label="Afficher le mot de passe">Voir</button>
                  </div>
                </div>

                <div class="auth-field">
                  <label for="registerPasswordConfirm">Confirmer le mot de passe</label>
                  <div class="auth-input-row">
                    <input id="registerPasswordConfirm" name="password_confirm" type="password" placeholder="Répétez le mot de passe" autocomplete="new-password" minlength="8" required>
                    <button type="button" class="auth-reveal-btn" data-reveal-target="registerPasswordConfirm" aria-controls="registerPasswordConfirm" aria-pressed="false" aria-label="Afficher la confirmation du mot de passe">Voir</button>
                  </div>
                </div>
              </fieldset>
            </div>

            <button id="registerBtn" type="submit" class="btn auth-primary auth-card-submit">Créer mon compte</button>
            <p class="auth-footnote">Déjà inscrit ? <button id="goToLoginBtn" type="button" class="auth-inline-link">Se connecter</button></p>
          </div>
        </form>
      </section>
    </div>`;

  authSection.setAttribute("aria-busy", "false");
  wirePasswordRevealButtons(authSection);

  const tablist = authSection.querySelector(".auth-switch");
  if (tablist) {
    tablist.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const tabLoginEl = document.getElementById("tabLogin");
      const isLogin = tabLoginEl?.getAttribute("aria-selected") === "true";
      if (e.key === "ArrowRight" && isLogin) showAuthMode("register");
      else if (e.key === "ArrowLeft" && !isLogin) showAuthMode("login");
    });
  }

  showAuthMode("login", { initial: true });
  document.getElementById("tabLogin").onclick = () => showAuthMode("login");
  document.getElementById("tabRegister").onclick = () =>
    showAuthMode("register");
  document.getElementById("goToRegisterBtn").onclick = () =>
    showAuthMode("register");
  document.getElementById("goToLoginBtn").onclick = () => showAuthMode("login");

  document.getElementById("loginForm").onsubmit = async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    setAuthError("loginError", "");

    if (!isValidEmail(email)) {
      setAuthError("loginError", "Indiquez une adresse e-mail valide.");
      return;
    }
    if (password.length < 8) {
      setAuthError(
        "loginError",
        "Le mot de passe doit contenir au moins 8 caractères.",
      );
      return;
    }

    try {
      await login(email, password);
      await bootstrapBoard();
    } catch (error) {
      setAuthError(
        "loginError",
        error.message || "Connexion impossible. Réessayez.",
      );
    }
  };

  document.getElementById("registerForm").onsubmit = async (event) => {
    event.preventDefault();
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const passwordConfirm = document.getElementById(
      "registerPasswordConfirm",
    ).value;
    setAuthError("registerError", "");

    if (name.length < 2) {
      setAuthError(
        "registerError",
        "Le nom doit contenir au moins 2 caractères.",
      );
      return;
    }
    if (!isValidEmail(email)) {
      setAuthError("registerError", "Indiquez une adresse e-mail valide.");
      return;
    }
    if (password.length < 8) {
      setAuthError(
        "registerError",
        "Le mot de passe doit contenir au moins 8 caractères.",
      );
      return;
    }
    if (password !== passwordConfirm) {
      setAuthError("registerError", "Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await register(name, email, password);
      await bootstrapBoard();
    } catch (error) {
      setAuthError(
        "registerError",
        error.message || "Inscription impossible. Réessayez.",
      );
    }
  };
}

async function bootstrapBoard() {
  if (!getToken()) return;
  const logoutBtn = document.getElementById("logoutBtn");
  const authSection = document.getElementById("authSection");
  const boardSection = document.getElementById("boardSection");
  const select = document.getElementById("boardSelect");
  const kanban = document.getElementById("kanbanBoard");
  if (!logoutBtn || !authSection || !boardSection || !select || !kanban) return;

  setAuthenticatedShell(true);
  refreshNavUser();

  logoutBtn.hidden = false;
  authSection.hidden = true;
  authSection.replaceChildren();
  boardSection.hidden = false;

  try {
    state.boards = await apiFetch("/api/boards");
    if (state.boards.length === 0) {
      const b = await apiFetch("/api/boards", {
        method: "POST",
        body: JSON.stringify({ name: "Mon tableau" }),
      });
      state.boards = [b];
    }
    fillBoardSelect(select, state.boards);
    state.activeBoardId = select.value || state.boards[0].id;
    syncBoardEditorFromState();
    await loadBoard(state.activeBoardId);
  } catch (err) {
    kanban.replaceChildren();
    const msg = document.createElement("p");
    msg.className = "board-inline-error";
    msg.setAttribute("role", "alert");
    msg.textContent =
      err instanceof Error
        ? err.message
        : "Impossible de charger les tableaux. Réessayez dans un instant.";
    kanban.appendChild(msg);
    return;
  }

  select.onchange = async () => {
    state.activeBoardId = select.value;
    syncBoardEditorFromState();
    await loadBoard(state.activeBoardId);
  };

  document.getElementById("saveBoardBtn").onclick = async () => {
    const id = select.value;
    const titleIn = document.getElementById("boardTitleInput");
    const descIn = document.getElementById("boardDescInput");
    setBoardToolbarError("");
    if (!id || !titleIn) return;
    const name = titleIn.value.trim();
    if (name.length < 2) {
      setBoardToolbarError("Le nom du tableau doit contenir au moins 2 caractères.");
      titleIn.focus();
      return;
    }
    const description = descIn ? descIn.value.trim() : "";
    try {
      await apiFetch(`/api/boards/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name, description }),
      });
      const b = state.boards.find((x) => x.id === id);
      if (b) {
        b.name = name;
        b.description = description === "" ? null : description;
      }
      fillBoardSelect(select, state.boards);
      select.value = id;
      syncBoardEditorFromState();
    } catch (err) {
      setBoardToolbarError(
        err instanceof Error ? err.message : "Enregistrement impossible.",
      );
    }
  };

  document.getElementById("deleteBoardBtn").onclick = async () => {
    const id = select.value;
    if (!id) return;
    if (
      !window.confirm(
        "Supprimer ce tableau et toutes ses colonnes et tâches ? Cette action est définitive.",
      )
    ) {
      return;
    }
    setBoardToolbarError("");
    try {
      await apiFetch(`/api/boards/${id}`, { method: "DELETE" });
      state.boards = state.boards.filter((b) => b.id !== id);
      if (state.boards.length === 0) {
        const b = await apiFetch("/api/boards", {
          method: "POST",
          body: JSON.stringify({ name: "Mon tableau" }),
        });
        state.boards = [b];
      }
      fillBoardSelect(select, state.boards);
      state.activeBoardId = select.value;
      syncBoardEditorFromState();
      await loadBoard(state.activeBoardId);
    } catch (err) {
      setBoardToolbarError(
        err instanceof Error ? err.message : "Suppression impossible.",
      );
    }
  };

  document.getElementById("createBoardBtn").onclick = async () => {
    const name = document.getElementById("newBoardName").value.trim();
    setBoardToolbarError("");
    if (!name) {
      setBoardToolbarError("Indiquez un nom de tableau.");
      document.getElementById("newBoardName")?.focus();
      return;
    }
    try {
      const board = await apiFetch("/api/boards", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      state.boards.push(board);
      fillBoardSelect(select, state.boards);
      select.value = board.id;
      document.getElementById("newBoardName").value = "";
      syncBoardEditorFromState();
      await loadBoard(board.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Création du tableau impossible.";
      setBoardToolbarError(message);
    }
  };
}

document.getElementById("logoutBtn").onclick = () => {
  logout();
  setAuthenticatedShell(false);
  location.reload();
};

wireShellNavigation();
wireAccountModal();

if (getToken()) {
  document.getElementById("logoutBtn").hidden = false;
  document.getElementById("boardSection").hidden = false;
  document.getElementById("authSection").hidden = true;
  document.getElementById("authSection").replaceChildren();
  setAuthenticatedShell(true);
  refreshProfileFromApi()
    .catch(() => {})
    .finally(() => {
      refreshNavUser();
      bootstrapBoard();
    });
} else {
  setAuthenticatedShell(false);
  refreshNavUser();
  document.getElementById("logoutBtn").hidden = true;
  document.getElementById("boardSection").hidden = true;
  document.getElementById("authSection").hidden = false;
  renderAuth();
}
