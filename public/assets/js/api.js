const TOKEN_STORAGE_KEY = "taskflow_token";

function getAppBasePath() {
  const meta = document.querySelector('meta[name="taskflow-base"]');
  if (meta && typeof meta.getAttribute("content") === "string") {
    return meta.getAttribute("content") || "";
  }
  if (typeof window.__TASKFLOW_BASE__ === "string") {
    return window.__TASKFLOW_BASE__;
  }
  return "";
}

function resolveApiUrl(path) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const base = getAppBasePath();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** Chemins où un 401 ne doit pas déclencher de refresh (login, inscription, refresh lui-même). */
function isAuthPathWithoutRefresh(path) {
  const base = path.split("?")[0];
  return (
    base.endsWith("/api/auth/login") ||
    base.endsWith("/api/auth/register") ||
    base.endsWith("/api/auth/refresh")
  );
}

async function postRefreshAccessToken() {
  const url = resolveApiUrl("/api/auth/refresh");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
    credentials: "include",
  });
  const json = await res.json().catch(() => ({ success: false }));
  if (!res.ok || !json.success || !json.data?.token) {
    return false;
  }
  localStorage.setItem(TOKEN_STORAGE_KEY, json.data.token);
  return true;
}

/**
 * Client API : JSON uniforme, timeout, cookie refresh sur 401 (une seule tentative).
 */
export async function apiFetch(path, options = {}) {
  const { _authRetried = false, ...fetchOptions } = options;
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const headers = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const url = resolveApiUrl(path);
    const res = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
      credentials: "include",
    });
    const json = await res.json().catch(() => ({ success: false, error: "Invalid JSON" }));

    const canTryRefresh =
      res.status === 401 &&
      !_authRetried &&
      Boolean(token) &&
      !isAuthPathWithoutRefresh(path);

    if (canTryRefresh) {
      const refreshed = await postRefreshAccessToken();
      if (refreshed) {
        return apiFetch(path, { ...fetchOptions, _authRetried: true });
      }
    }

    if (!res.ok || !json.success) {
      throw new Error(json.error || `HTTP ${res.status}`);
    }
    return json.data;
  } finally {
    clearTimeout(timeout);
  }
}
