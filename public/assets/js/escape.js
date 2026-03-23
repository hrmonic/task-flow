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
