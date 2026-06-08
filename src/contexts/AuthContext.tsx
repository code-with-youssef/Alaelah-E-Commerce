"use client";

import React, { createContext, useContext } from "react";
import { useUser } from "../hooks/user/useUser";

interface AuthContextType {
  user: any;
  loading: boolean;
  refetch: () => void;
  logout: () => Promise<void>; // ← add this
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refetch: () => {},
  logout: async () => {}, // ← add this
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, refetch, logout } = useUser(); // ← destructure logout

  return (
    <AuthContext.Provider value={{ user, loading, refetch, logout }}> {/* ← pass it */}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);