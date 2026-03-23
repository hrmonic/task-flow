import { apiFetch } from "./api.js";

const USER_KEY = "taskflow_user";

export function getToken() {
  return localStorage.getItem("taskflow_token");
}

export function getSessionUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (u && typeof u.name === "string") return u;
    return null;
  } catch {
    return null;
  }
}

export function setSessionUser(user) {
  if (user && typeof user.name === "string") {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        name: user.name,
        email: typeof user.email === "string" ? user.email : "",
      }),
    );
  }
}

export function clearSessionUser() {
  localStorage.removeItem(USER_KEY);
}

/** Rafraîchit le profil depuis l’API et met à jour le stockage local (nom, e-mail). */
export async function refreshProfileFromApi() {
  const data = await apiFetch("/api/auth/me");
  if (data?.name) {
    setSessionUser({
      name: data.name,
      email: typeof data.email === "string" ? data.email : "",
    });
  }
  return data;
}

export function logout() {
  localStorage.removeItem("taskflow_token");
  clearSessionUser();
}

export async function login(email, password) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("taskflow_token", data.token);
  if (data.user) setSessionUser(data.user);
  return data;
}

export async function register(name, email, password) {
  const data = await apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  localStorage.setItem("taskflow_token", data.token);
  if (data.user) setSessionUser(data.user);
  return data;
}
