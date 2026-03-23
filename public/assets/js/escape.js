const ALLOWED_TASK_PRIORITY = new Set(["low", "medium", "high", "urgent"]);

export function escapeHtml(value) {
  if (value == null) {
    return "";
  }
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function taskPriorityClass(priority) {
  return ALLOWED_TASK_PRIORITY.has(priority) ? priority : "medium";
}

const PRIORITY_SHORT = {
  low: "Basse",
  medium: "Normale",
  high: "Haute",
  urgent: "Urgente",
};

export function taskPriorityLabel(priority) {
  const p = taskPriorityClass(priority);
  return PRIORITY_SHORT[p] ?? PRIORITY_SHORT.medium;
}

/** @param {string | null | undefined} iso Date SQL ou ISO */
export function formatRelativeDueDate(iso) {
  if (!iso || typeof iso !== "string") return "";
  const raw = iso.trim().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return "";
  const d = new Date(`${raw}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  const startOf = (x) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const now = new Date();
  const diffDays = Math.round(
    (startOf(d) - startOf(now)) / 86400000,
  );
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Demain";
  if (diffDays === -1) return "Hier";
  if (diffDays > 1 && diffDays <= 7) return `Dans ${diffDays} j`;
  if (diffDays < -1 && diffDays >= -7) return `Il y a ${-diffDays} j`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
