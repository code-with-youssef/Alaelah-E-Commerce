import { resolveApiBaseUrl } from "@/src/config/apiResolver";
import { getToken, clearToken } from "./tokenServices";
import { getCurrentLocale } from "@/src/i18n/getCurrentLocale";
import { getGuestId } from "../persistence/guestId";

let isRefreshing = false;

type QueuedRequest = {
  url: string;
  options: RequestInit;
  resolve: (value: Response) => void;
  reject: (error: any) => void;
};

let failedQueue: QueuedRequest[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(async (req) => {
    if (error) {
      req.reject(error);
      return;
    }
    try {
      const token = getToken();
      const retryOptions: RequestInit = {
        ...req.options,
        headers: {
          ...req.options.headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
      const res = await fetch(req.url, retryOptions);
      req.resolve(res);
    } catch (err) {
      req.reject(err);
    }
  });
  failedQueue = [];
};

let cachedBaseUrl: string | null = null;
const getBaseUrl = async () => {
  if (cachedBaseUrl) return cachedBaseUrl;
  cachedBaseUrl = await resolveApiBaseUrl();
  return cachedBaseUrl;
};

export async function apiRequest(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const baseUrl = await getBaseUrl();
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "App-Language": getCurrentLocale(),
    "System-Key": "12345678",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    // Authenticated request — use bearer token
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    // Guest request — attach the guest_id so the backend can identify the session
    const guestId = getGuestId(); // ← NEW
    if (guestId) {
      headers["guest_id"] = guestId; // ← NEW
    }
  }

  const finalOptions: RequestInit = { ...options, headers };
  const fullUrl = `${baseUrl}${path}`;

  try {
    const response = await fetch(fullUrl, finalOptions);

    if (response.status === 401 && token) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            url: fullUrl,
            options: finalOptions,
            resolve,
            reject,
          });
        });
      }
      isRefreshing = true;
      try {
        clearToken();
        if (typeof window !== "undefined") {
          window.location.href = `/`;
        }
        processQueue(new Error("Unauthorized"));
      } finally {
        isRefreshing = false;
      }
      return response;
    }

    return response;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}
