export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("taskflow_token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(path, { ...options, headers, signal: controller.signal, credentials: "include" });
    const json = await res.json().catch(() => ({ success: false, error: "Invalid JSON" }));
    if (!res.ok || !json.success) {
      throw new Error(json.error || `HTTP ${res.status}`);
    }
    return json.data;
  } finally {
    clearTimeout(timeout);
  }
}
