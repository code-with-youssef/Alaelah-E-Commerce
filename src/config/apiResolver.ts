// src/config/apiResolver.ts
// ✅ Client-safe — no fs, no secrets

let cachedBaseUrl: string | null = null;

export const setApiBaseUrl = (url: string) => {
  cachedBaseUrl = url;
};

export const resolveApiBaseUrl = async (): Promise<string> => {
  if (cachedBaseUrl) return cachedBaseUrl;
  throw new Error("apiBaseUrl not initialized — was setApiBaseUrl called in Providers?");
};