// resolveUrl.ts
import { getBaseUrl, getBaseUrlReady } from "../config/baseUrlStore";

const isAbsolute = (path: string) => /^https?:\/\//i.test(path);

// ✅ Sync version — only use when you're SURE base URL is already initialized
export const resolveUrl = (path?: string | null): string => {
  if (!path) return "";
  if (isAbsolute(path)) return path;

  const base = getBaseUrl();
  if (!base) return ""; // explicitly return empty instead of broken relative URL
  
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

// ✅ Async version — always returns a correct URL
export const resolveUrlAsync = async (path?: string | null): Promise<string> => {
  if (!path) return "";
  if (isAbsolute(path)) return path;

  const base = await getBaseUrlReady(); // waits if not ready yet
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};