// lib/ProtectedRoute.tsx
"use client";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/common/Loader";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader />
      </div>
    );
  }

  if (!user) {
    // While redirecting, show a small loader
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Authenticated users can access the protected content
  return <>{children}</>;
}
