// tokenServices.ts
let token: string | null =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

let refreshTimeout: NodeJS.Timeout | null = null;

// --- Token Management ---
export const setToken = (newToken: string) => {
  if (typeof window !== "undefined") {
    token = newToken;
    localStorage.setItem("token", newToken);
    
    // Clear any existing timeout
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    
    // Schedule token check (e.g., 1 minute before expiry if you know expiry time)
    // This is optional - you can rely on 401 responses instead
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return token || localStorage.getItem("token");
  }
  return token;
};

// --- Clear Token ---
export const clearToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
  token = null;
  
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
  
  // Dispatch event for components to react
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("tokenCleared"));
  }
};

// --- Check if Token Exists ---
export const hasToken = (): boolean => {
  return !!getToken();
};

// --- Token Expiry Check ---
export const checkTokenExpiry = (): boolean => {
  const token = getToken();
  if (!token) return true;
  
  // If your token is a JWT, you can decode it to check expiry
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiryTime;
  } catch {
    return false; // If can't decode, assume valid
  }
};