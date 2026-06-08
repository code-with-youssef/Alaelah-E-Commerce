// src/config/resolveApiBaseUrlServer.ts
// ✅ Server-only — secrets never reach the browser
import "server-only";
import { loadAppConfig } from "./loadAppConfig";

export const resolveApiBaseUrlServer = async (): Promise<string> => {
  const config = await loadAppConfig();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/Domains/by-credentials?clientId=${config.client_id}&clientSecret=${config.client_secret}`
  );

  if (!res.ok) throw new Error("Failed to resolve API base URL");

  const data: { baseUrl: string } = await res.json();
  return data.baseUrl;
};