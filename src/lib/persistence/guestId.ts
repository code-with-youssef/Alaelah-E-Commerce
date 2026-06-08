// src/lib/guestId.ts
// ─────────────────────────────────────────────────────────────────────────────
// Manages the guest_id cookie for unauthenticated sessions.
//
// Lifecycle:
//   1. First visit with no token  →  ensureGuestId() mints a UUID cookie
//   2. Every API call as guest    →  apiClient reads it via getGuestId()
//                                    and sends it as "X-Guest-ID" header
//   3. User logs in               →  clearGuestId() deletes the cookie
// ─────────────────────────────────────────────────────────────────────────────

const COOKIE_NAME = "guest_id";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for very old browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** Read the current guest_id from cookies without any side-effects. */
export function getGuestId(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Ensure a guest_id cookie exists and return it.
 * Safe to call multiple times — returns the existing value if already set.
 * Call this on app boot whenever there is NO auth token.
 */
export function ensureGuestId(): string {
  const existing = getGuestId();
  if (existing) return existing;

  const id = generateUUID();
  document.cookie = [
    `${COOKIE_NAME}=${encodeURIComponent(id)}`,
    `max-age=${ONE_YEAR_SECONDS}`,
    "path=/",
    "SameSite=Lax",
    // Append "; Secure" in production (not here so localhost still works)
  ].join("; ");
  return id;
}

/** Delete the guest_id cookie immediately. Call after a successful login. */
export function clearGuestId(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; max-age=0; path=/`;
}