/** Historique limité pour annuler le dernier déplacement de tâche (Ctrl+Z). */

const MAX = 20;
const stack = [];

/**
 * @param {{ taskId: string; columnId: string; position: number }} snapshot
 */
export function pushMoveSnapshot(snapshot) {
  stack.push({ ...snapshot, at: Date.now() });
  while (stack.length > MAX) stack.shift();
}

export function popMoveSnapshot() {
  return stack.pop() ?? null;
}

export function clearHistory() {
  stack.length = 0;
}
