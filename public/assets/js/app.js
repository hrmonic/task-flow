import { apiFetch } from "./api.js";
import { login, register, logout, getToken } from "./auth.js";
import { loadBoard } from "./kanban.js";

const state = { boards: [], activeBoardId: null };

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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showAuthMode(mode) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  if (!loginForm || !registerForm || !tabLogin || !tabRegister) return;

  const isLogin = mode === "login";
  loginForm.hidden = !isLogin;
  registerForm.hidden = isLogin;
  loginForm.setAttribute("aria-hidden", String(!isLogin));
  registerForm.setAttribute("aria-hidden", String(isLogin));
  tabLogin.classList.toggle("is-active", isLogin);
  tabRegister.classList.toggle("is-active", !isLogin);
  tabLogin.setAttribute("aria-selected", String(isLogin));
  tabRegister.setAttribute("aria-selected", String(!isLogin));
  (isLogin ? document.getElementById("loginEmail") : document.getElementById("registerName"))?.focus();
}

function renderAuth() {
  const authSection = document.getElementById("authSection");
  if (!authSection) return;
  authSection.innerHTML = `
    <div class="auth-wrap">
      <section class="auth-shell" aria-labelledby="authTitle">
        <div class="auth-head">
          <p class="auth-kicker">TaskFlow</p>
          <h2 id="authTitle">Bienvenue</h2>
          <p class="auth-subtitle">Connectez-vous pour reprendre vos boards, ou creez un compte en moins d'une minute.</p>
        </div>

        <div class="auth-switch" role="tablist" aria-label="Mode d'authentification">
          <button id="tabLogin" type="button" class="auth-switch-btn is-active" role="tab" aria-selected="true" aria-controls="loginForm">
            Connexion
          </button>
          <button id="tabRegister" type="button" class="auth-switch-btn" role="tab" aria-selected="false" aria-controls="registerForm">
            Inscription
          </button>
        </div>

        <form id="loginForm" class="auth-card" novalidate aria-labelledby="authTitle">
          <div id="loginError" class="auth-error" hidden role="alert" aria-live="polite"></div>

          <div class="field">
            <label for="loginEmail">Email professionnel</label>
            <input id="loginEmail" type="email" placeholder="vous@entreprise.com" autocomplete="email" inputmode="email" required>
          </div>

          <div class="field">
            <label for="loginPassword">Mot de passe</label>
            <input id="loginPassword" type="password" placeholder="Votre mot de passe" autocomplete="current-password" minlength="8" required>
          </div>

          <button id="loginBtn" type="submit" class="btn auth-primary">Se connecter</button>
          <p class="auth-footnote">Pas encore de compte ? <button id="goToRegisterBtn" type="button" class="auth-inline-link">Creer un compte</button></p>
        </form>

        <form id="registerForm" class="auth-card" hidden novalidate aria-labelledby="authTitle" aria-hidden="true">
          <div id="registerError" class="auth-error" hidden role="alert" aria-live="polite"></div>

          <div class="field">
            <label for="registerName">Nom complet</label>
            <input id="registerName" placeholder="John Doe" autocomplete="name" minlength="2" required>
          </div>

          <div class="field">
            <label for="registerEmail">Email professionnel</label>
            <input id="registerEmail" type="email" placeholder="vous@entreprise.com" autocomplete="email" inputmode="email" required>
          </div>

          <div class="field">
            <label for="registerPassword">Mot de passe</label>
            <input id="registerPassword" type="password" placeholder="Au moins 8 caracteres" autocomplete="new-password" minlength="8" required>
          </div>

          <div class="field">
            <label for="registerPasswordConfirm">Confirmer le mot de passe</label>
            <input id="registerPasswordConfirm" type="password" placeholder="Repetez le mot de passe" autocomplete="new-password" minlength="8" required>
          </div>

          <button id="registerBtn" type="submit" class="btn auth-primary">Creer mon compte</button>
          <p class="auth-footnote">Deja inscrit ? <button id="goToLoginBtn" type="button" class="auth-inline-link">Se connecter</button></p>
        </form>
      </section>
    </div>`;

  showAuthMode("login");
  document.getElementById("tabLogin").onclick = () => showAuthMode("login");
  document.getElementById("tabRegister").onclick = () => showAuthMode("register");
  document.getElementById("goToRegisterBtn").onclick = () => showAuthMode("register");
  document.getElementById("goToLoginBtn").onclick = () => showAuthMode("login");

  document.getElementById("loginForm").onsubmit = async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    setAuthError("loginError", "");

    if (!isValidEmail(email)) {
      setAuthError("loginError", "Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setAuthError("loginError", "Password must contain at least 8 characters.");
      return;
    }

    try {
      await login(email, password);
      await bootstrapBoard();
    } catch (error) {
      setAuthError("loginError", error.message || "Login failed.");
    }
  };

  document.getElementById("registerForm").onsubmit = async (event) => {
    event.preventDefault();
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const passwordConfirm = document.getElementById("registerPasswordConfirm").value;
    setAuthError("registerError", "");

    if (name.length < 2) {
      setAuthError("registerError", "Name must contain at least 2 characters.");
      return;
    }
    if (!isValidEmail(email)) {
      setAuthError("registerError", "Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setAuthError("registerError", "Password must contain at least 8 characters.");
      return;
    }
    if (password !== passwordConfirm) {
      setAuthError("registerError", "Passwords do not match.");
      return;
    }

    try {
      await register(name, email, password);
      await bootstrapBoard();
    } catch (error) {
      setAuthError("registerError", error.message || "Registration failed.");
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

  logoutBtn.hidden = false;
  authSection.hidden = true;
  authSection.replaceChildren();
  boardSection.hidden = false;

  try {
    state.boards = await apiFetch("/api/boards");
    if (state.boards.length === 0) {
      const b = await apiFetch("/api/boards", { method: "POST", body: JSON.stringify({ name: "My Board" }) });
      state.boards = [b];
    }
    fillBoardSelect(select, state.boards);
    state.activeBoardId = select.value || state.boards[0].id;
    await loadBoard(state.activeBoardId);
  } catch (err) {
    kanban.replaceChildren();
    const msg = document.createElement("p");
    msg.className = "auth-error";
    msg.setAttribute("role", "alert");
    msg.textContent = err instanceof Error ? err.message : "Unable to load boards.";
    kanban.appendChild(msg);
    return;
  }

  select.onchange = async () => {
    state.activeBoardId = select.value;
    await loadBoard(state.activeBoardId);
  };

  document.getElementById("createBoardBtn").onclick = async () => {
    const name = document.getElementById("newBoardName").value.trim();
    if (!name) return;
    try {
      const board = await apiFetch("/api/boards", { method: "POST", body: JSON.stringify({ name }) });
      state.boards.push(board);
      fillBoardSelect(select, state.boards);
      select.value = board.id;
      await loadBoard(board.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not create board.";
      window.alert(message);
    }
  };
}

document.getElementById("logoutBtn").onclick = () => {
  logout();
  location.reload();
};

if (getToken()) {
  document.getElementById("logoutBtn").hidden = false;
  document.getElementById("boardSection").hidden = false;
  document.getElementById("authSection").hidden = true;
  document.getElementById("authSection").replaceChildren();
  bootstrapBoard();
} else {
  document.getElementById("logoutBtn").hidden = true;
  document.getElementById("boardSection").hidden = true;
  document.getElementById("authSection").hidden = false;
  renderAuth();
}
