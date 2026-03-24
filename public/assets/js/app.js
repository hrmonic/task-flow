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
import { popMoveSnapshot } from "./boardHistory.js";
import { loadBoard, reloadActiveBoard } from "./kanban.js";

const state = { boards: [], activeBoardId: null };
const THEME_STORAGE_KEY = "taskflow_theme";
const APP_VIEW_STORAGE_KEY = "taskflow_active_view";

/** @type {AbortController | null} */
let paletteKeyAbort = null;

const BOARD_DOT_PALETTE = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f97316",
];

function setThemeMetaColor(theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  meta.setAttribute("content", theme === "light" ? "#f3f6ff" : "#0d0e14");
}

function setThemeToggleState(theme) {
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
  const isLight = theme === "light";
  const label = isLight ? "Activer le mode sombre" : "Activer le mode clair";
  const icon = isLight
    ? `<svg viewBox="0 0 24 24" fill="none" class="theme-toggle-svg" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.8A9 9 0 1 1 11.2 3c-.1.4-.2.9-.2 1.4a7 7 0 0 0 8.6 6.8c.5-.1 1-.3 1.4-.4Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" class="theme-toggle-svg" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5V5M12 19V21.5M21.5 12H19M5 12H2.5M18.4 5.6 16.7 7.3M7.3 16.7 5.6 18.4M18.4 18.4 16.7 16.7M7.3 7.3 5.6 5.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  btn.setAttribute("aria-pressed", String(isLight));
  btn.setAttribute(
    "aria-label",
    label,
  );
  const labelNode = btn.querySelector(".theme-toggle-label");
  const iconNode = btn.querySelector(".theme-toggle-icon");
  if (labelNode) {
    labelNode.textContent = label;
  } else {
    btn.textContent = label;
  }
  if (iconNode) {
    iconNode.innerHTML = icon;
  }
}

function applyTheme(theme, persist = true) {
  const nextTheme = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", nextTheme);
  setThemeMetaColor(nextTheme);
  setThemeToggleState(nextTheme);
  if (persist) {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }
}

function initTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    applyTheme(stored, false);
    return;
  }
  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
  applyTheme(prefersLight ? "light" : "dark", false);
}

function wireThemeToggle() {
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
    applyTheme(current === "light" ? "dark" : "light");
  });
}

function boardAccent(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return BOARD_DOT_PALETTE[h % BOARD_DOT_PALETTE.length];
}

function setAuthenticatedShell(active) {
  document.body.classList.toggle("is-authenticated", active);
}

function getDashboardEl() {
  return document.getElementById("dashboardSection");
}

function getBoardSectionEl() {
  return document.getElementById("boardSection");
}

function getStoredAppView() {
  const stored = localStorage.getItem(APP_VIEW_STORAGE_KEY);
  return stored === "boards" ? "boards" : "dashboard";
}

function persistAppView(view) {
  if (view === "dashboard" || view === "boards") {
    localStorage.setItem(APP_VIEW_STORAGE_KEY, view);
  }
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
    persistAppView("dashboard");
    return;
  }
  if (view === "boards") {
    if (dash) dash.hidden = true;
    if (board) board.hidden = false;
    if (auth) auth.hidden = true;
    persistAppView("boards");
  }
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (id === "main-content") el.focus({ preventScroll: true });
  }
}

function closeMobileNav() {
  const panel = document.getElementById("navMain");
  const btn = document.getElementById("navMenuToggle");
  if (panel) panel.classList.remove("is-open");
  if (btn) btn.setAttribute("aria-expanded", "false");
}

function wireMobileNav() {
  const btn = document.getElementById("navMenuToggle");
  const panel = document.getElementById("navMain");
  if (!btn || !panel) return;
  btn.addEventListener("click", () => {
    const open = !panel.classList.contains("is-open");
    panel.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
  });
}

function showToast(message, isError = false) {
  const host = document.getElementById("toastHost");
  if (!host || !message) return;
  const t = document.createElement("div");
  t.className = `tf-toast${isError ? " tf-toast--error" : ""}`;
  t.textContent = message;
  host.appendChild(t);
  setTimeout(() => {
    t.remove();
  }, 3200);
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
      closeMobileNav();
    });
  });
}

function wireAccountModal() {
  const open = async () => {
    await openAccountModal();
    refreshNavUser();
    closeMobileNav();
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

function renderBoardSidebar(boards, activeId) {
  const aside = document.getElementById("boardSidebar");
  const ul = document.getElementById("boardSidebarList");
  if (!aside || !ul) return;
  aside.hidden = boards.length === 0;
  ul.replaceChildren();
  boards.forEach((b) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "tf-board-item" + (b.id === activeId ? " is-active" : "");
    btn.dataset.boardId = b.id;
    const dot = document.createElement("span");
    dot.className = "tf-board-dot";
    dot.style.background = boardAccent(b.id);
    dot.setAttribute("aria-hidden", "true");
    btn.appendChild(dot);
    btn.appendChild(document.createTextNode(b.name || "Sans nom"));
    btn.addEventListener("click", async () => {
      const sel = document.getElementById("boardSelect");
      if (sel) sel.value = b.id;
      state.activeBoardId = b.id;
      syncBoardEditorFromState();
      renderBoardSidebar(state.boards, state.activeBoardId);
      try {
        await loadBoard(b.id);
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Chargement impossible.",
          true,
        );
      }
      closeMobileNav();
    });
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

async function createBoardByName(rawName) {
  const name = (rawName || "").trim();
  setBoardToolbarError("");
  if (!name) {
    setBoardToolbarError("Indiquez un nom de tableau.");
    return false;
  }

  const select = document.getElementById("boardSelect");
  if (!select) return false;

  try {
    const board = await apiFetch("/api/boards", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    state.boards.push(board);
    fillBoardSelect(select, state.boards);
    select.value = board.id;
    state.activeBoardId = board.id;
    syncBoardEditorFromState();
    renderBoardSidebar(state.boards, state.activeBoardId);
    await loadBoard(board.id);
    return true;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Création du tableau impossible.";
    setBoardToolbarError(message);
    return false;
  }
}

function wireSidebarBoardCreator() {
  const input = document.getElementById("sidebarNewBoardName");
  const btn = document.getElementById("sidebarCreateBoardBtn");
  if (!input || !btn) return;

  const submitCreate = async () => {
    if (btn.disabled) return;
    btn.disabled = true;
    const created = await createBoardByName(input.value);
    btn.disabled = false;
    if (created) {
      input.value = "";
      input.focus();
      closeMobileNav();
    } else {
      input.focus();
    }
  };

  btn.addEventListener("click", () => {
    submitCreate();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    submitCreate();
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
      <section class="auth-section-inner" aria-labelledby="authTitle">
        <div class="auth-head">
          <p class="auth-kicker">Votre espace Kanban</p>
          <h1 id="authTitle" class="tf-h1" style="font-size:1.5rem">Bienvenue</h1>
          <p class="auth-subtitle">Connectez-vous pour reprendre vos tableaux, ou créez un compte en moins d'une minute.</p>
        </div>

        <div class="tf-card auth-card">
          <div class="tf-card-body p-auth">
            <div class="tf-auth-tabs" role="tablist" aria-label="Connexion ou inscription">
              <button id="tabLogin" type="button" class="tf-auth-tab" role="tab" aria-selected="true" aria-controls="loginForm" tabindex="0">Connexion</button>
              <button id="tabRegister" type="button" class="tf-auth-tab" role="tab" aria-selected="false" aria-controls="registerForm" tabindex="-1">Inscription</button>
            </div>

            <form id="loginForm" role="tabpanel" aria-labelledby="tabLogin" novalidate>
              <h3 class="tf-h3 mb-3" style="font-size:1.05rem" id="loginFormHeading">Connexion</h3>
              <div id="loginError" class="tf-alert tf-alert--danger mb-3" hidden role="alert" aria-live="assertive"></div>
              <fieldset class="tf-fieldset">
                <legend class="tf-sr-only">Identifiants</legend>
                <div class="tf-field">
                  <label class="tf-label" for="loginEmail">Adresse e-mail</label>
                  <input id="loginEmail" name="email" class="tf-input" type="email" placeholder="vous@entreprise.com" autocomplete="email" inputmode="email" required>
                </div>
                <div class="tf-field">
                  <label class="tf-label" for="loginPassword">Mot de passe</label>
                  <div class="tf-input-row">
                    <input id="loginPassword" name="password" class="tf-input" type="password" placeholder="Votre mot de passe" autocomplete="current-password" minlength="8" required>
                    <button type="button" class="tf-btn tf-btn--ghost tf-btn--sm auth-reveal-btn" data-reveal-target="loginPassword" aria-controls="loginPassword" aria-pressed="false" aria-label="Afficher le mot de passe">Voir</button>
                  </div>
                </div>
              </fieldset>
              <button id="loginBtn" type="submit" class="tf-btn tf-btn--primary tf-btn--block" style="margin-top:0.5rem">Se connecter</button>
              <p class="tf-muted text-center mt-3 mb-0" style="font-size:0.8125rem">Pas encore de compte ? <button id="goToRegisterBtn" type="button" class="tf-btn tf-btn--link">Créer un compte</button></p>
            </form>

            <form id="registerForm" role="tabpanel" aria-labelledby="tabRegister" hidden novalidate aria-hidden="true">
              <h3 class="tf-h3 mb-3" style="font-size:1.05rem" id="registerFormHeading">Inscription</h3>
              <div id="registerError" class="tf-alert tf-alert--danger mb-3" hidden role="alert" aria-live="assertive"></div>
              <fieldset class="tf-fieldset">
                <legend class="tf-sr-only">Nouveau compte</legend>
                <div class="tf-field">
                  <label class="tf-label" for="registerName">Nom complet</label>
                  <input id="registerName" name="name" class="tf-input" type="text" placeholder="Jean Dupont" autocomplete="name" minlength="2" required>
                </div>
                <div class="tf-field">
                  <label class="tf-label" for="registerEmail">Adresse e-mail</label>
                  <input id="registerEmail" name="email" class="tf-input" type="email" placeholder="vous@entreprise.com" autocomplete="email" inputmode="email" required>
                </div>
                <div class="tf-field">
                  <label class="tf-label" for="registerPassword">Mot de passe</label>
                  <div class="tf-input-row">
                    <input id="registerPassword" name="password" class="tf-input" type="password" placeholder="Au moins 8 caractères" autocomplete="new-password" minlength="8" required>
                    <button type="button" class="tf-btn tf-btn--ghost tf-btn--sm auth-reveal-btn" data-reveal-target="registerPassword" aria-controls="registerPassword" aria-pressed="false" aria-label="Afficher le mot de passe">Voir</button>
                  </div>
                </div>
                <div class="tf-field">
                  <label class="tf-label" for="registerPasswordConfirm">Confirmer le mot de passe</label>
                  <div class="tf-input-row">
                    <input id="registerPasswordConfirm" name="password_confirm" class="tf-input" type="password" placeholder="Répétez le mot de passe" autocomplete="new-password" minlength="8" required>
                    <button type="button" class="tf-btn tf-btn--ghost tf-btn--sm auth-reveal-btn" data-reveal-target="registerPasswordConfirm" aria-controls="registerPasswordConfirm" aria-pressed="false" aria-label="Afficher la confirmation du mot de passe">Voir</button>
                  </div>
                </div>
              </fieldset>
              <button id="registerBtn" type="submit" class="tf-btn tf-btn--primary tf-btn--block" style="margin-top:0.5rem">Créer mon compte</button>
              <p class="tf-muted text-center mt-3 mb-0" style="font-size:0.8125rem">Déjà inscrit ? <button id="goToLoginBtn" type="button" class="tf-btn tf-btn--link">Se connecter</button></p>
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

function isTypingTarget(el) {
  if (!el || !(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT")
    return true;
  return el.isContentEditable;
}

function closeCommandPalette() {
  paletteKeyAbort?.abort();
  paletteKeyAbort = null;
  const p = document.getElementById("commandPalette");
  if (p) {
    p.hidden = true;
    p.replaceChildren();
  }
}

function openCommandPalette() {
  const host = document.getElementById("commandPalette");
  if (!host || !getToken()) return;
  closeCommandPalette();
  host.hidden = false;
  host.innerHTML = `
    <div class="tf-palette-backdrop" aria-hidden="true"></div>
    <div class="tf-palette" role="dialog" aria-modal="true" aria-label="Commandes">
      <input type="search" class="tf-palette-input" id="paletteFilter" placeholder="Filtrer les commandes…" autocomplete="off" />
      <p class="tf-palette-hint">Flèches et Entrée · <kbd>Échap</kbd> fermer</p>
      <ul id="paletteList" class="tf-palette-list"></ul>
    </div>`;

  const cmds = [
    {
      id: "boards",
      label: "Ouvrir les tableaux Kanban",
      run: () => {
        closeCommandPalette();
        showAppView("boards");
        scrollToSection("boardSection");
        closeMobileNav();
      },
    },
    {
      id: "dash",
      label: "Retour au tableau de bord",
      run: () => {
        closeCommandPalette();
        showAppView("dashboard");
        scrollToSection("main-content");
      },
    },
    {
      id: "account",
      label: "Mon compte",
      run: async () => {
        closeCommandPalette();
        await openAccountModal();
        refreshNavUser();
      },
    },
    {
      id: "col",
      label: "Nouvelle colonne",
      run: () => {
        closeCommandPalette();
        document.querySelector(".add-column-btn")?.click();
      },
    },
  ];

  const listEl = document.getElementById("paletteList");
  const filterEl = document.getElementById("paletteFilter");
  let filtered = [...cmds];
  let hi = 0;

  function renderList() {
    if (!listEl) return;
    listEl.replaceChildren();
    filtered.forEach((c, i) => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tf-palette-item" + (i === hi ? " is-active" : "");
      b.textContent = c.label;
      b.addEventListener("click", () => {
        c.run();
      });
      li.appendChild(b);
      listEl.appendChild(li);
    });
  }

  function applyFilter() {
    const q = (filterEl?.value || "").trim().toLowerCase();
    filtered = cmds.filter(
      (c) => !q || c.label.toLowerCase().includes(q) || c.id.includes(q),
    );
    hi = 0;
    renderList();
  }

  applyFilter();
  filterEl?.focus();
  filterEl?.addEventListener("input", applyFilter);

  paletteKeyAbort = new AbortController();
  const onKey = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeCommandPalette();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      hi = Math.min(filtered.length - 1, hi + 1);
      renderList();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      hi = Math.max(0, hi - 1);
      renderList();
    } else if (e.key === "Enter" && filtered[hi]) {
      e.preventDefault();
      filtered[hi].run();
    }
  };
  document.addEventListener("keydown", onKey, {
    signal: paletteKeyAbort.signal,
  });
  host.querySelector(".tf-palette-backdrop")?.addEventListener(
    "click",
    () => {
      closeCommandPalette();
    },
    { once: true },
  );
}

function closeShortcutHelp() {
  const h = document.getElementById("shortcutHelp");
  if (h) {
    h.hidden = true;
    h.replaceChildren();
  }
}

function openShortcutHelp() {
  const h = document.getElementById("shortcutHelp");
  if (!h) return;
  h.hidden = false;
  h.innerHTML = `
    <div class="tf-modal-backdrop" aria-hidden="true"></div>
    <div class="tf-modal-panel tf-modal-panel--wide">
      <div class="tf-modal-content" role="dialog" aria-modal="true" aria-labelledby="shortcutHelpTitle">
        <div class="tf-modal-header">
          <h3 id="shortcutHelpTitle">Raccourcis clavier</h3>
          <button type="button" class="tf-modal-close" id="shortcutHelpClose" aria-label="Fermer">×</button>
        </div>
        <div class="tf-modal-body tf-shortcut-list">
          <p><kbd>Ctrl</kbd> + <kbd>K</kbd> — Palette de commandes</p>
          <p><kbd>N</kbd> — Nouvelle tâche (première colonne)</p>
          <p><kbd>C</kbd> — Nouvelle colonne</p>
          <p><kbd>Ctrl</kbd> + <kbd>Z</kbd> — Annuler le dernier déplacement de tâche</p>
          <p><kbd>?</kbd> — Cette aide</p>
          <p><kbd>Échap</kbd> — Fermer palette / aide</p>
        </div>
      </div>
    </div>`;
  const close = () => {
    document.removeEventListener("keydown", onDoc);
    closeShortcutHelp();
  };
  const onDoc = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };
  document.addEventListener("keydown", onDoc);
  h.querySelector("#shortcutHelpClose")?.addEventListener("click", close);
  h.querySelector(".tf-modal-backdrop")?.addEventListener("click", close);
}

async function undoLastTaskMove() {
  const snap = popMoveSnapshot();
  if (!snap) {
    showToast("Rien à annuler pour le moment.");
    return;
  }
  try {
    await apiFetch(`/api/tasks/${snap.taskId}/move`, {
      method: "PATCH",
      body: JSON.stringify({
        column_id: snap.columnId,
        position: snap.position,
      }),
    });
    await reloadActiveBoard();
    showToast("Déplacement annulé.");
  } catch {
    showToast("Impossible d'annuler ce déplacement.", true);
    await reloadActiveBoard();
  }
}

function wireGlobalShortcuts() {
  document.addEventListener("keydown", (e) => {
    const paletteOpen =
      document.getElementById("commandPalette") &&
      !document.getElementById("commandPalette").hidden;
    const helpOpen =
      document.getElementById("shortcutHelp") &&
      !document.getElementById("shortcutHelp").hidden;

    if (e.key === "Escape") {
      if (paletteOpen) {
        e.preventDefault();
        closeCommandPalette();
        return;
      }
      if (helpOpen) {
        e.preventDefault();
        closeShortcutHelp();
        return;
      }
    }

    const metaOrCtrl = e.ctrlKey || e.metaKey;
    if (metaOrCtrl && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (getToken()) openCommandPalette();
      return;
    }
    if (metaOrCtrl && e.key.toLowerCase() === "z" && !e.shiftKey) {
      if (!getToken()) return;
      const boardVis = getBoardSectionEl() && !getBoardSectionEl().hidden;
      if (!boardVis) return;
      e.preventDefault();
      undoLastTaskMove();
      return;
    }

    if (e.key === "?" || (e.shiftKey && e.key === "/")) {
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      openShortcutHelp();
      return;
    }

    if (!getToken()) return;
    const boardSection = getBoardSectionEl();
    const boardVis = boardSection && !boardSection.hidden;
    if (!boardVis) return;
    if (isTypingTarget(e.target)) return;

    if (e.key.toLowerCase() === "n") {
      e.preventDefault();
      const first = document.querySelector(
        ".kanban-column:not(.kanban-column--add) .add-task",
      );
      first?.click();
    } else if (e.key.toLowerCase() === "c") {
      e.preventDefault();
      document.querySelector(".add-column-btn")?.click();
    }
  });
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
  wireSidebarBoardCreator();

  logoutBtn.hidden = false;
  authSection.hidden = true;
  authSection.replaceChildren();
  showAppView(getStoredAppView());

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
    renderBoardSidebar(state.boards, state.activeBoardId);
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
    renderBoardSidebar(state.boards, state.activeBoardId);
    try {
      await loadBoard(state.activeBoardId);
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Chargement du tableau impossible.",
        true,
      );
    }
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
      renderBoardSidebar(state.boards, state.activeBoardId);
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
      renderBoardSidebar(state.boards, state.activeBoardId);
      await loadBoard(state.activeBoardId);
    } catch (err) {
      setBoardToolbarError(
        err instanceof Error ? err.message : "Suppression impossible.",
      );
    }
  };

}

document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem(APP_VIEW_STORAGE_KEY);
  logout();
  setAuthenticatedShell(false);
  location.reload();
};

wireMobileNav();
wireShellNavigation();
wireAccountModal();
wireGlobalShortcuts();
initTheme();
wireThemeToggle();

if (getToken()) {
  document.getElementById("logoutBtn").hidden = false;
  document.getElementById("authSection").hidden = true;
  document.getElementById("authSection").replaceChildren();
  setAuthenticatedShell(true);
  showAppView(getStoredAppView());
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
