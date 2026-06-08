// baseUrlStore.ts
import { resolveApiBaseUrl } from "./apiResolver";

let baseUrl: string = "";
let initPromise: Promise<string> | null = null;

export const initBaseUrl = (): Promise<string> => {
  if (baseUrl) return Promise.resolve(baseUrl);
  if (initPromise) return initPromise;

  initPromise = resolveApiBaseUrl().then((url) => {
    baseUrl = url;
    initPromise = null;
    return url;
  });

  return initPromise;
};

export const getBaseUrl = () => baseUrl;

// ✅ New: expose the ready promise so consumers can await it
export const getBaseUrlReady = (): Promise<string> => {
  if (baseUrl) return Promise.resolve(baseUrl);
  return initBaseUrl();
};