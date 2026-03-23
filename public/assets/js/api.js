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

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("taskflow_token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const url = resolveApiUrl(path);
    const res = await fetch(url, { ...options, headers, signal: controller.signal, credentials: "include" });
    const json = await res.json().catch(() => ({ success: false, error: "Invalid JSON" }));
    if (!res.ok || !json.success) {
      throw new Error(json.error || `HTTP ${res.status}`);
    }
    return json.data;
  } finally {
    clearTimeout(timeout);
  }
}
