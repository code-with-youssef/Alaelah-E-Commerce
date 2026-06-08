// src/lib/storage.ts

const STORE_ID_KEY = "nearest_store_id";
const LOCATION_PICKED_KEY = "location_picked";
const LOCATION_ADDRESS_KEY = "location_address"; // ← NEW

// ── Nearest store ─────────────────────────────────────────────────────────────

export function loadNearestStoreId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORE_ID_KEY);
  return raw ? Number(raw) : null;
}

export function saveNearestStoreId(id: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_ID_KEY, String(id));
}

export function clearNearestStoreId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORE_ID_KEY);
}

// ── Location-picked flag ──────────────────────────────────────────────────────

export function hasPickedLocation(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(LOCATION_PICKED_KEY) === "1";
}

export function setPickedLocation(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCATION_PICKED_KEY, "1");
}

export function clearPickedLocation(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCATION_PICKED_KEY);
}

// ── Saved address string ──────────────────────────────────────────────────────

export function loadSavedAddress(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LOCATION_ADDRESS_KEY);
}

export function saveAddress(address: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCATION_ADDRESS_KEY, address);
}

export function clearSavedAddress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCATION_ADDRESS_KEY);
}

// ── Clear everything on logout ────────────────────────────────────────────────

export function clearAllLocationData(): void {
  clearNearestStoreId();
  clearPickedLocation();
  clearSavedAddress();
}