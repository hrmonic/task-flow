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

function getDashboardEl() {
  return document.getElementById("dashboardSection");
}

function getBoardSectionEl() {
  return document.getElementById("boardSection");
}

/** @param {"dashboard" | "boards" | "auth"} view */
function showAppView(view) {
  const dash = getDashboardEl();
  const board = getBoardSectionEl();
  const auth = document.getElementById("authSection");
  if (view === "auth") {
    if (dash) dash.hidden = true;
    if (board) board.hidden = true;
    if (auth) auth.hidden = false;
    return;
  }
  if (!getToken()) return;
  if (view === "dashboard") {
    if (dash) dash.hidden = false;
    if (board) board.hidden = true;
    if (auth) auth.hidden = true;
    return;
  }
  if (view === "boards") {
    if (dash) dash.hidden = true;
    if (board) board.hidden = false;
    if (auth) auth.hidden = true;
  }
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (id === "main-content") el.focus({ preventScroll: true });
  }
}

function collapseBootstrapNav() {
  const navEl = document.getElementById("navMain");
  if (!navEl || !window.bootstrap?.Collapse) return;
  const inst = window.bootstrap.Collapse.getInstance(navEl);
  if (inst) inst.hide();
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
  document.querySelectorAll("[data-nav-target]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const target = el.getAttribute("data-nav-target");
      if (!target) return;
      e.preventDefault();
      if (target === "main") {
        if (getToken()) {
          showAppView("dashboard");
          scrollToSection("main-content");
        } else {
          showAppView("auth");
          scrollToSection("authSection");
        }
      } else if (target === "auth") {
        showAppView("auth");
        scrollToSection("authSection");
      } else if (target === "boards") {
        if (!getToken()) {
          showAppView("auth");
          scrollToSection("authSection");
          return;
        }
        showAppView("boards");
        scrollToSection("boardSection");
      } else if (target === "about") {
        scrollToSection("aboutSection");
      }
      collapseBootstrapNav();
    });
  });
}

function wireAccountModal() {
  const open = async () => {
    await openAccountModal();
    refreshNavUser();
    collapseBootstrapNav();
  };
  document.getElementById("openAccountBtn")?.addEventListener("click", open);
  document.getElementById("openAccountFromDashboard")?.addEventListener("click", open);
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
  tabLogin.classList.toggle("active", isLogin);
  tabRegister.classList.toggle("active", !isLogin);
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
      <section class="mx-auto" style="max-width:28rem" aria-labelledby="authTitle">
        <div class="auth-head">
          <p class="auth-kicker">Votre espace Kanban</p>
          <h1 id="authTitle" class="h2 fw-bold">Bienvenue</h1>
          <p class="auth-subtitle">Connectez-vous pour reprendre vos tableaux, ou créez un compte en moins d'une minute.</p>
        </div>

        <div class="card auth-card bg-body-tertiary border-secondary shadow">
          <div class="card-body p-3 p-md-4">
            <ul class="nav nav-pills nav-fill gap-2 mb-4" role="tablist" aria-label="Connexion ou inscription">
              <li class="nav-item" role="presentation">
                <button id="tabLogin" type="button" class="nav-link active" role="tab" aria-selected="true" aria-controls="loginForm" tabindex="0">Connexion</button>
              </li>
              <li class="nav-item" role="presentation">
                <button id="tabRegister" type="button" class="nav-link" role="tab" aria-selected="false" aria-controls="registerForm" tabindex="-1">Inscription</button>
              </li>
            </ul>

            <form id="loginForm" role="tabpanel" aria-labelledby="tabLogin" novalidate>
              <h3 class="h5 fw-semibold mb-3" id="loginFormHeading">Connexion</h3>
              <div id="loginError" class="alert alert-danger py-2 small" hidden role="alert" aria-live="assertive"></div>
              <fieldset class="border-0 p-0 m-0">
                <legend class="visually-hidden">Identifiants</legend>
                <div class="mb-3">
                  <label class="form-label" for="loginEmail">Adresse e-mail</label>
                  <input id="loginEmail" name="email" class="form-control" type="email" placeholder="vous@entreprise.com" autocomplete="email" inputmode="email" required>
                </div>
                <div class="mb-4">
                  <label class="form-label" for="loginPassword">Mot de passe</label>
                  <div class="input-group">
                    <input id="loginPassword" name="password" class="form-control" type="password" placeholder="Votre mot de passe" autocomplete="current-password" minlength="8" required>
                    <button type="button" class="btn btn-outline-secondary auth-reveal-btn" data-reveal-target="loginPassword" aria-controls="loginPassword" aria-pressed="false" aria-label="Afficher le mot de passe">Voir</button>
                  </div>
                </div>
              </fieldset>
              <button id="loginBtn" type="submit" class="btn btn-primary w-100 py-2 fw-semibold">Se connecter</button>
              <p class="text-center text-secondary small mt-3 mb-0">Pas encore de compte ? <button id="goToRegisterBtn" type="button" class="btn btn-link btn-sm p-0 align-baseline">Créer un compte</button></p>
            </form>

            <form id="registerForm" role="tabpanel" aria-labelledby="tabRegister" hidden novalidate aria-hidden="true">
              <h3 class="h5 fw-semibold mb-3" id="registerFormHeading">Inscription</h3>
              <div id="registerError" class="alert alert-danger py-2 small" hidden role="alert" aria-live="assertive"></div>
              <fieldset class="border-0 p-0 m-0">
                <legend class="visually-hidden">Nouveau compte</legend>
                <div class="mb-3">
                  <label class="form-label" for="registerName">Nom complet</label>
                  <input id="registerName" name="name" class="form-control" type="text" placeholder="Jean Dupont" autocomplete="name" minlength="2" required>
                </div>
                <div class="mb-3">
                  <label class="form-label" for="registerEmail">Adresse e-mail</label>
                  <input id="registerEmail" name="email" class="form-control" type="email" placeholder="vous@entreprise.com" autocomplete="email" inputmode="email" required>
                </div>
                <div class="mb-3">
                  <label class="form-label" for="registerPassword">Mot de passe</label>
                  <div class="input-group">
                    <input id="registerPassword" name="password" class="form-control" type="password" placeholder="Au moins 8 caractères" autocomplete="new-password" minlength="8" required>
                    <button type="button" class="btn btn-outline-secondary auth-reveal-btn" data-reveal-target="registerPassword" aria-controls="registerPassword" aria-pressed="false" aria-label="Afficher le mot de passe">Voir</button>
                  </div>
                </div>
                <div class="mb-4">
                  <label class="form-label" for="registerPasswordConfirm">Confirmer le mot de passe</label>
                  <div class="input-group">
                    <input id="registerPasswordConfirm" name="password_confirm" class="form-control" type="password" placeholder="Répétez le mot de passe" autocomplete="new-password" minlength="8" required>
                    <button type="button" class="btn btn-outline-secondary auth-reveal-btn" data-reveal-target="registerPasswordConfirm" aria-controls="registerPasswordConfirm" aria-pressed="false" aria-label="Afficher la confirmation du mot de passe">Voir</button>
                  </div>
                </div>
              </fieldset>
              <button id="registerBtn" type="submit" class="btn btn-primary w-100 py-2 fw-semibold">Créer mon compte</button>
              <p class="text-center text-secondary small mt-3 mb-0">Déjà inscrit ? <button id="goToLoginBtn" type="button" class="btn btn-link btn-sm p-0 align-baseline">Se connecter</button></p>
            </form>
          </div>
        </div>
      </section>
    </div>`;

  authSection.setAttribute("aria-busy", "false");
  wirePasswordRevealButtons(authSection);

  const tablist = authSection.querySelector('[role="tablist"]');
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
  showAppView("dashboard");

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
    msg.className = "board-inline-error mb-0";
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
  document.getElementById("authSection").hidden = true;
  document.getElementById("authSection").replaceChildren();
  setAuthenticatedShell(true);
  showAppView("dashboard");
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
  showAppView("auth");
  renderAuth();
}
