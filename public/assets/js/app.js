import { apiFetch } from "./api.js";
import { login, register, logout, getToken } from "./auth.js";
import { loadBoard } from "./kanban.js";

const state = { boards: [], activeBoardId: null };

function renderAuth() {
  const authSection = document.getElementById("authSection");
  authSection.innerHTML = `
    <div class="auth-card">
      <h2>Login</h2>
      <input id="email" placeholder="Email">
      <input id="password" type="password" placeholder="Password">
      <button id="loginBtn" class="btn">Login</button>
      <h2>Create account</h2>
      <input id="name" placeholder="Name">
      <button id="registerBtn" class="btn secondary">Register</button>
    </div>`;

  document.getElementById("loginBtn").onclick = async () => {
    await login(document.getElementById("email").value, document.getElementById("password").value);
    await bootstrapBoard();
  };
  document.getElementById("registerBtn").onclick = async () => {
    await register(
      document.getElementById("name").value,
      document.getElementById("email").value,
      document.getElementById("password").value
    );
    await bootstrapBoard();
  };
}

async function bootstrapBoard() {
  if (!getToken()) return;
  document.getElementById("authSection").classList.add("hidden");
  document.getElementById("boardSection").classList.remove("hidden");

  state.boards = await apiFetch("/api/boards");
  const select = document.getElementById("boardSelect");
  if (state.boards.length === 0) {
    const b = await apiFetch("/api/boards", { method: "POST", body: JSON.stringify({ name: "My Board" }) });
    state.boards = [b];
  }
  select.innerHTML = state.boards.map((b) => `<option value="${b.id}">${b.name}</option>`).join("");
  state.activeBoardId = select.value || state.boards[0].id;
  await loadBoard(state.activeBoardId);

  select.onchange = async () => {
    state.activeBoardId = select.value;
    await loadBoard(state.activeBoardId);
  };

  document.getElementById("createBoardBtn").onclick = async () => {
    const name = document.getElementById("newBoardName").value.trim();
    if (!name) return;
    const board = await apiFetch("/api/boards", { method: "POST", body: JSON.stringify({ name }) });
    state.boards.push(board);
    select.innerHTML = state.boards.map((b) => `<option value="${b.id}">${b.name}</option>`).join("");
    select.value = board.id;
    await loadBoard(board.id);
  };
}

document.getElementById("logoutBtn").onclick = () => {
  logout();
  location.reload();
};

renderAuth();
bootstrapBoard();
