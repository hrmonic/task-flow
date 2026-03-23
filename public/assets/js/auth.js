import { apiFetch } from "./api.js";

export function getToken() {
  return localStorage.getItem("taskflow_token");
}

export function logout() {
  localStorage.removeItem("taskflow_token");
}

export async function login(email, password) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("taskflow_token", data.token);
  return data;
}

export async function register(name, email, password) {
  const data = await apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  localStorage.setItem("taskflow_token", data.token);
  return data;
}
