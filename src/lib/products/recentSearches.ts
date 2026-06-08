const KEY = "app:recent_searches";
const MAX = 5;

/**
 * Load saved recent searches from localStorage (newest first).
 */
export function loadRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/**
 * Prepend a new term to the recent list, dedup, and cap at MAX.
 */
export function saveRecentSearch(term: string): void {
  if (typeof window === "undefined") return;
  const trimmed = term.trim();
  if (!trimmed) return;
  try {
    const existing = loadRecentSearches();
    const deduped = [trimmed, ...existing.filter((t) => t !== trimmed)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(deduped));
  } catch {
    // quota exceeded — silently ignore
  }
}

/**
 * Remove a specific term from recent searches.
 */
export function removeRecentSearch(term: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadRecentSearches();
    localStorage.setItem(KEY, JSON.stringify(existing.filter((t) => t !== term)));
  } catch {}
}

/**
 * Clear all recent searches.
 */
export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {}
}