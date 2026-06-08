// src/hooks/useUser.ts
"use client";

import { useEffect, useState } from "react";
import { clearGuestId } from "../../lib/persistence/guestId";
import { clearAllLocationData } from "../../lib/persistence/storage"; // ← NEW
import { User } from "../../types/user/user";
import { clearToken, getToken } from "@/src/lib/shared/tokenServices";
import { apiRequest } from "@/src/lib/shared/apiClient";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    async function fetchUser() {
      const token = getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await apiRequest(
          "/api/v2/auth/get-user-by-access_token",
          { method: "POST" }
        );
        if (!response.ok) {
          if (response.status === 401) {
            clearToken();
            setUser(null);
          }
          setLoading(false);
          return;
        }
        const result = await response.json();
        setUser(result.user || null);
        if (result.user) clearGuestId();
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [refetchTrigger]);

  useEffect(() => {
    const handleTokenCleared = () => { setUser(null); refetch(true); };
    const handleUserLoggedIn = () => { clearGuestId(); refetch(); };
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") refetch();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("tokenCleared", handleTokenCleared);
      window.addEventListener("userLoggedIn", handleUserLoggedIn);
      window.addEventListener("storage", handleStorageChange);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("tokenCleared", handleTokenCleared);
        window.removeEventListener("userLoggedIn", handleUserLoggedIn);
        window.removeEventListener("storage", handleStorageChange);
      }
    };
  }, []);

  const refetch = (silent = false) => {
    if (!silent) setLoading(true);
    setRefetchTrigger((prev) => prev + 1);
  };

  const logout = async () => {
    try {
      const token = getToken();
      if (token) await apiRequest("/v1/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      clearToken();
      clearGuestId();
      clearAllLocationData(); // ← clears location_picked + nearest_store_id
      setUser(null);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("tokenCleared"));
        window.location.href = "/";
      }
    }
  };

  return { user, loading, refetch, logout };
}