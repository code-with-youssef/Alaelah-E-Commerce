"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { deleteAccount, updateProfile } from "../../lib/user/profile";
import { clearToken } from "@/src/lib/shared/tokenServices";

export function useProfile() {
  const { refetch } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const saveProfile = async (name: string, phone: string): Promise<void> => {
    setIsSaving(true);

    try {
      await updateProfile(name, phone);
      await refetch();
    } finally {
      setIsSaving(false);
    }
  };

  const removeAccount = async (): Promise<void> => {
    setIsDeleting(true);

    try {
      await deleteAccount();
      clearToken();

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("tokenCleared"));
        window.location.href = "/auth/login";
      }
    } catch (error) {
      setIsDeleting(false);
      throw error;
    }
  };

  return {
    saveProfile,
    removeAccount,
    isSaving,
    isDeleting,
  };
}