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

const state = {
  boards: [],
  activeBoardId: null,
  boardCanManageContributors: false,
  pendingInvitations: [],
};
const THEME_STORAGE_KEY = "taskflow_theme";
const APP_VIEW_STORAGE_KEY = "taskflow_active_view";
const ACTIVE_BOARD_STORAGE_KEY = "taskflow_active_board_id";
const BOARD_ICON_STORAGE_KEY = "taskflow_board_icon_map";
const LAYOUT_SIDEBAR_KEY = "taskflow_layout_sidebar_visible";
const LAYOUT_INFO_KEY = "taskflow_layout_info_visible";
const LAYOUT_ACTIVITY_KEY = "taskflow_layout_activity_visible";

/** @type {AbortController | null} */
let paletteKeyAbort = null;
let boardActivityPollInterval = null;

const BOARD_DOT_PALETTE = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f97316",
];

const BOARD_ICON_LIBRARY = {
  none: { label: "Aucun pictogramme", svg: "" },
  design: { label: "Design", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.7 0 3-1.1 3-2.5 0-.8-.4-1.5-1-2 .9-.2 1.8-.5 2.6-1 1.4-.8 2.4-2.2 2.4-3.9 0-4.7-3.8-8.6-8.6-8.6H12Z" stroke="currentColor" stroke-width="1.8"/><circle cx="7.7" cy="10" r="1.1" fill="currentColor"/><circle cx="10.3" cy="7.2" r="1.1" fill="currentColor"/><circle cx="14.1" cy="7.5" r="1.1" fill="currentColor"/></svg>` },
  accounting: { label: "Comptabilité", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19h14M7 16V8m5 8V5m5 11v-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M15 5.2c.5-.5 1.3-.7 2-.4.7.3 1.2.9 1.2 1.7 0 1.4-1.4 2.2-3.2 2.5M9 8.2c.5-.5 1.3-.7 2-.4.7.3 1.2.9 1.2 1.7 0 1.4-1.4 2.2-3.2 2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>` },
  communication: { label: "Communication", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16v9H8l-4 4V7Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m7 10 5 3 5-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  management: { label: "Management", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="7" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M6 20a6 6 0 0 1 12 0M4 13l2 2 3-3M20 13l-2 2-3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>` },
  strategy: { label: "Stratégie", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20V5m0 15h15m-9-4 3-3 2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  marketing: { label: "Marketing", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 14c2.2-2.2 5.6-2.2 7.8 0M3 10.2c4.4-4.4 11.6-4.4 16 0M7.8 18.2a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>` },
  product: { label: "Produit", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21 4 16.5v-9L12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m4 7.5 8 4.5 8-4.5" stroke="currentColor" stroke-width="1.8"/></svg>` },
  hr: { label: "Ressources humaines", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="8" r="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 19a4.5 4.5 0 0 1 9 0M11.5 19a4.5 4.5 0 0 1 9 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>` },
  legal: { label: "Juridique", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v16M7 7h10M5 20h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7 7 4 12h6L7 7Zm10 0-3 5h6l-3-5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>` },
  operations: { label: "Opérations", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>` },
  it: { label: "IT / Développement", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 9-3 3 3 3m8-6 3 3-3 3M10 19l4-14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  finance: { label: "Finance", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19h16M6 16V9m4 7V5m4 11v-8m4 8v-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>` },
  sales: { label: "Commercial", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 15h4l2-6 3 9 2-5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  education: { label: "Éducation", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m3 8 9-4 9 4-9 4-9-4Zm3 3.5v4.8c0 .5.2.9.6 1.1 3.6 2.1 7.2 2.1 10.8 0 .4-.2.6-.6.6-1.1v-4.8" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>` },
  health: { label: "Santé", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20s-6.5-3.9-8.6-7.7C1.8 9.4 3.2 6 6.6 6c2.1 0 3.3 1.2 4.1 2.4.8-1.2 2-2.4 4.1-2.4 3.4 0 4.8 3.4 3.2 6.3C18.5 16.1 12 20 12 20Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>` },
  logistics: { label: "Logistique", svg: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7h13v8H3zM16 10h3l2 2v3h-5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="7" cy="17" r="1.8" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="17" r="1.8" stroke="currentColor" stroke-width="1.8"/></svg>` },
};

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

function getStoredActiveBoardId() {
  const stored = localStorage.getItem(ACTIVE_BOARD_STORAGE_KEY);
  return stored && stored.trim() ? stored : null;
}

function persistActiveBoardId(boardId) {
  if (!boardId) return;
  localStorage.setItem(ACTIVE_BOARD_STORAGE_KEY, boardId);
}

function isLayoutVisible(storageKey, defaultVisible = true) {
  const raw = localStorage.getItem(storageKey);
  if (raw === null) return defaultVisible;
  return raw === "1";
}

function persistLayoutVisible(storageKey, visible) {
  localStorage.setItem(storageKey, visible ? "1" : "0");
}

function applyBoardLayoutVisibility() {
  const sidebar = document.getElementById("boardSidebar");
  const info = document.getElementById("boardInfoPanel");
  const activity = document.getElementById("boardActivityPanel");
  const toggleSidebar = document.getElementById("toggleSidebarBtn");
  const toggleInfo = document.getElementById("toggleBoardInfoBtn");
  const toggleActivity = document.getElementById("toggleBoardActivityBtn");
  const sidebarVisible = isLayoutVisible(LAYOUT_SIDEBAR_KEY, true);
  const infoVisible = isLayoutVisible(LAYOUT_INFO_KEY, true);
  const activityVisible = isLayoutVisible(LAYOUT_ACTIVITY_KEY, true);

  if (sidebar) sidebar.hidden = !sidebarVisible;
  if (info) info.hidden = !infoVisible;
  if (activity) activity.hidden = !activityVisible;
  if (toggleSidebar) toggleSidebar.textContent = sidebarVisible ? "Masquer la barre latérale" : "Afficher la barre latérale";
  if (toggleInfo) toggleInfo.textContent = infoVisible ? "Masquer les informations" : "Afficher les informations";
  if (toggleActivity) toggleActivity.textContent = activityVisible ? "Masquer l'historique" : "Afficher l'historique";
}

function wireBoardLayoutToggles() {
  const toggleSidebar = document.getElementById("toggleSidebarBtn");
  const toggleInfo = document.getElementById("toggleBoardInfoBtn");
  const toggleActivity = document.getElementById("toggleBoardActivityBtn");
  toggleSidebar?.addEventListener("click", () => {
    persistLayoutVisible(LAYOUT_SIDEBAR_KEY, !isLayoutVisible(LAYOUT_SIDEBAR_KEY, true));
    applyBoardLayoutVisibility();
  });
  toggleInfo?.addEventListener("click", () => {
    persistLayoutVisible(LAYOUT_INFO_KEY, !isLayoutVisible(LAYOUT_INFO_KEY, true));
    applyBoardLayoutVisibility();
  });
  toggleActivity?.addEventListener("click", () => {
    persistLayoutVisible(LAYOUT_ACTIVITY_KEY, !isLayoutVisible(LAYOUT_ACTIVITY_KEY, true));
    applyBoardLayoutVisibility();
  });
}

function getBoardIconMap() {
  try {
    const raw = localStorage.getItem(BOARD_ICON_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function setBoardIconMap(map) {
  localStorage.setItem(BOARD_ICON_STORAGE_KEY, JSON.stringify(map));
}

function normalizeBoardIconKey(iconKey) {
  if (!iconKey || typeof iconKey !== "string") return "none";
  return BOARD_ICON_LIBRARY[iconKey] ? iconKey : "none";
}

function getBoardIconKey(boardId) {
  if (!boardId) return "none";
  const map = getBoardIconMap();
  return normalizeBoardIconKey(map[boardId]);
}

function setBoardIconKey(boardId, iconKey) {
  if (!boardId) return;
  const map = getBoardIconMap();
  const next = normalizeBoardIconKey(iconKey);
  if (next === "none") {
    delete map[boardId];
  } else {
    map[boardId] = next;
  }
  setBoardIconMap(map);
}

function removeBoardIconKey(boardId) {
  if (!boardId) return;
  const map = getBoardIconMap();
  if (!Object.prototype.hasOwnProperty.call(map, boardId)) return;
  delete map[boardId];
  setBoardIconMap(map);
}

function populateBoardIconSelect() {
  const select = document.getElementById("boardIconSelect");
  if (!select) return;
  select.replaceChildren();
  Object.entries(BOARD_ICON_LIBRARY).forEach(([key, meta]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = meta.label;
    select.appendChild(option);
  });
}

function syncBoardIconSelect(boardId) {
  const select = document.getElementById("boardIconSelect");
  if (!select) return;
  select.value = getBoardIconKey(boardId);
}

function wireBoardIconPicker() {
  const select = document.getElementById("boardIconSelect");
  if (!select) return;
  populateBoardIconSelect();
  select.addEventListener("change", () => {
    if (!state.activeBoardId) return;
    setBoardIconKey(state.activeBoardId, select.value);
    renderBoardSidebar(state.boards, state.activeBoardId);
  });
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
  syncBoardIconSelect(id);
}

function setBoardToolbarError(message = "") {
  const el = document.getElementById("boardToolbarError");
  if (!el) return;
  el.textContent = message;
  el.hidden = !message;
}

function describeActivityAction(action) {
  if (action === "task_created") return "a créé une tâche";
  if (action === "task_updated") return "a modifié une tâche";
  if (action === "task_moved") return "a déplacé une tâche";
  return "a modifié une tâche";
}

function formatActivityDate(value) {
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderBoardActivity(items) {
  const host = document.getElementById("boardActivityList");
  if (!host) return;
  host.replaceChildren();
  if (!Array.isArray(items) || items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "tf-muted mb-0";
    empty.textContent = "Aucune modification récente.";
    host.appendChild(empty);
    return;
  }
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "board-activity-item";
    const main = document.createElement("div");
    main.textContent = `${item.actor_name || "Un contributeur"} ${describeActivityAction(item.action)}.`;
    const meta = document.createElement("div");
    meta.className = "board-activity-meta";
    meta.textContent = formatActivityDate(item.created_at);
    row.append(main, meta);
    host.appendChild(row);
  });
}

async function refreshBoardActivity() {
  if (!state.activeBoardId) {
    renderBoardActivity([]);
    return;
  }
  try {
    const activity = await apiFetch(`/api/boards/${state.activeBoardId}/activity`);
    renderBoardActivity(Array.isArray(activity) ? activity : []);
  } catch {
    renderBoardActivity([]);
  }
}

function startBoardActivityPolling() {
  if (boardActivityPollInterval) {
    window.clearInterval(boardActivityPollInterval);
    boardActivityPollInterval = null;
  }
  boardActivityPollInterval = window.setInterval(() => {
    const panel = document.getElementById("boardActivityPanel");
    if (!panel || panel.hidden) return;
    refreshBoardActivity();
  }, 25000);
}

function updateInvitationBadge(count) {
  const badge = document.getElementById("navInvitationCount");
  if (!badge) return;
  badge.hidden = count <= 0;
  badge.textContent = String(count);
}

function renderInvitationPanel(invitations) {
  const panel = document.getElementById("invitationPanel");
  const list = document.getElementById("invitationList");
  if (!panel || !list) return;
  panel.hidden = invitations.length === 0;
  list.replaceChildren();
  invitations.forEach((inv) => {
    const row = document.createElement("div");
    row.className = "invitation-item";
    const text = document.createElement("div");
    text.className = "invitation-item-text";
    text.textContent = `${inv.inviter_name} vous invite sur "${inv.board_name}"`;
    row.appendChild(text);
    const actions = document.createElement("div");
    actions.className = "invitation-actions";
    const accept = document.createElement("button");
    accept.type = "button";
    accept.className = "tf-btn tf-btn--success tf-btn--sm";
    accept.textContent = "Accepter";
    accept.addEventListener("click", () => respondInvitation(inv.id, "accept"));
    const reject = document.createElement("button");
    reject.type = "button";
    reject.className = "tf-btn tf-btn--ghost tf-btn--sm";
    reject.textContent = "Refuser";
    reject.addEventListener("click", () => respondInvitation(inv.id, "reject"));
    actions.append(accept, reject);
    row.appendChild(actions);
    list.appendChild(row);
  });
}

async function refreshIncomingInvitations() {
  if (!getToken()) return;
  try {
    const invitations = await apiFetch("/api/invitations");
    state.pendingInvitations = Array.isArray(invitations) ? invitations : [];
    updateInvitationBadge(state.pendingInvitations.length);
    renderInvitationPanel(state.pendingInvitations);
  } catch {
    updateInvitationBadge(0);
    renderInvitationPanel([]);
  }
}

async function respondInvitation(invitationId, action) {
  const endpoint = action === "accept" ? "accept" : "reject";
  try {
    await apiFetch(`/api/invitations/${invitationId}/${endpoint}`, { method: "POST", body: JSON.stringify({}) });
    await refreshIncomingInvitations();
    await bootstrapBoard();
    showToast(action === "accept" ? "Invitation acceptée." : "Invitation refusée.");
  } catch (err) {
    showToast(err instanceof Error ? err.message : "Action impossible.", true);
  }
}

function wireInvitationNav() {
  const btn = document.getElementById("openInvitationsBtn");
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    showAppView("boards");
    scrollToSection("invitationPanel");
    closeMobileNav();
  });
}

function renderBoardContributors(contributors, canManage) {
  const host = document.getElementById("boardContributorsList");
  if (!host) return;
  host.replaceChildren();
  contributors.forEach((c) => {
    const chip = document.createElement("span");
    chip.className =
      "board-contributor-chip" + (c.role === "owner" ? " board-contributor-chip--owner" : "");
    const name = document.createElement("span");
    name.textContent = c.name;
    const role = document.createElement("span");
    role.className = "board-contributor-chip-role";
    role.textContent = c.role === "owner" ? "Propriétaire" : "Contributeur";
    chip.append(name, role);
    if (canManage && c.role !== "owner") {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "board-contributor-remove";
      remove.title = "Retirer ce contributeur";
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        removeContributor(c.id);
      });
      chip.appendChild(remove);
    }
    host.appendChild(chip);
  });
}

async function refreshBoardContributors() {
  const input = document.getElementById("boardContributorInput");
  const btn = document.getElementById("boardInviteBtn");
  if (!state.activeBoardId) {
    renderBoardContributors([], false);
    if (input) input.disabled = true;
    if (btn) btn.disabled = true;
    return;
  }
  try {
    const data = await apiFetch(`/api/boards/${state.activeBoardId}/contributors`);
    const contributors = Array.isArray(data?.contributors) ? data.contributors : [];
    const canManage = Boolean(data?.can_manage);
    state.boardCanManageContributors = canManage;
    if (input) input.disabled = !canManage;
    if (btn) btn.disabled = !canManage;
    renderBoardContributors(contributors, canManage);
  } catch {
    state.boardCanManageContributors = false;
    if (input) input.disabled = true;
    if (btn) btn.disabled = true;
    renderBoardContributors([], false);
  }
}

async function inviteContributorFromInput() {
  const input = document.getElementById("boardContributorInput");
  const btn = document.getElementById("boardInviteBtn");
  if (!input || !btn || !state.activeBoardId) return;
  const identifier = input.value.trim();
  if (!identifier) {
    setBoardToolbarError("Indiquez un nom d'utilisateur ou un email.");
    input.focus();
    return;
  }
  setBoardToolbarError("");
  btn.disabled = true;
  try {
    const data = await apiFetch(`/api/boards/${state.activeBoardId}/contributors/invite`, {
      method: "POST",
      body: JSON.stringify({ identifier }),
    });
    input.value = "";
    await refreshBoardContributors();
    await refreshIncomingInvitations();
    if (data?.mail_sent) {
      showToast("Invitation envoyée (application + e-mail).");
    } else {
      showToast("Invitation envoyée dans l'application (e-mail non envoyé).");
    }
  } catch (err) {
    setBoardToolbarError(err instanceof Error ? err.message : "Invitation impossible.");
  } finally {
    btn.disabled = false;
  }
}

async function removeContributor(userId) {
  if (!state.activeBoardId || !state.boardCanManageContributors) return;
  try {
    await apiFetch(`/api/boards/${state.activeBoardId}/contributors/${userId}`, { method: "DELETE" });
    await refreshBoardContributors();
    showToast("Contributeur retiré.");
  } catch (err) {
    showToast(err instanceof Error ? err.message : "Suppression impossible.", true);
  }
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
  aside.hidden = boards.length === 0 || !isLayoutVisible(LAYOUT_SIDEBAR_KEY, true);
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
    const name = document.createElement("span");
    name.className = "tf-board-item-text";
    name.textContent = b.name || "Sans nom";
    btn.appendChild(name);
    const iconKey = getBoardIconKey(b.id);
    if (iconKey !== "none") {
      const icon = document.createElement("span");
      icon.className = "tf-board-item-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = BOARD_ICON_LIBRARY[iconKey].svg;
      btn.appendChild(icon);
    }
    btn.addEventListener("click", async () => {
      const sel = document.getElementById("boardSelect");
      if (sel) sel.value = b.id;
      state.activeBoardId = b.id;
      persistActiveBoardId(state.activeBoardId);
      syncBoardEditorFromState();
      renderBoardSidebar(state.boards, state.activeBoardId);
      try {
        await loadBoard(b.id);
        await refreshBoardContributors();
        await refreshBoardActivity();
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
    persistActiveBoardId(state.activeBoardId);
    syncBoardEditorFromState();
    renderBoardSidebar(state.boards, state.activeBoardId);
    await loadBoard(board.id);
    await refreshBoardContributors();
    await refreshBoardActivity();
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

function wireContributorControls() {
  const input = document.getElementById("boardContributorInput");
  const btn = document.getElementById("boardInviteBtn");
  if (!input || !btn) return;
  btn.addEventListener("click", () => {
    inviteContributorFromInput();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    inviteContributorFromInput();
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
  wireBoardIconPicker();
  wireContributorControls();
  wireBoardLayoutToggles();
  applyBoardLayoutVisibility();
  startBoardActivityPolling();

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
    const storedBoardId = getStoredActiveBoardId();
    const hasStoredBoard = storedBoardId
      ? state.boards.some((b) => b.id === storedBoardId)
      : false;
    state.activeBoardId = hasStoredBoard
      ? storedBoardId
      : select.value || state.boards[0].id;
    select.value = state.activeBoardId;
    persistActiveBoardId(state.activeBoardId);
    syncBoardEditorFromState();
    renderBoardSidebar(state.boards, state.activeBoardId);
    await loadBoard(state.activeBoardId);
    await refreshBoardContributors();
    await refreshIncomingInvitations();
    await refreshBoardActivity();
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
    persistActiveBoardId(state.activeBoardId);
    syncBoardEditorFromState();
    renderBoardSidebar(state.boards, state.activeBoardId);
    try {
      await loadBoard(state.activeBoardId);
      await refreshBoardContributors();
      await refreshBoardActivity();
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
      await refreshBoardContributors();
      await refreshBoardActivity();
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
      removeBoardIconKey(id);
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
      persistActiveBoardId(state.activeBoardId);
      syncBoardEditorFromState();
      renderBoardSidebar(state.boards, state.activeBoardId);
      await loadBoard(state.activeBoardId);
      await refreshBoardContributors();
      await refreshBoardActivity();
    } catch (err) {
      setBoardToolbarError(
        err instanceof Error ? err.message : "Suppression impossible.",
      );
    }
  };

}

document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem(APP_VIEW_STORAGE_KEY);
  localStorage.removeItem(ACTIVE_BOARD_STORAGE_KEY);
  logout();
  setAuthenticatedShell(false);
  location.reload();
};

wireMobileNav();
wireShellNavigation();
wireAccountModal();
wireInvitationNav();
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
