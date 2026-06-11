// src/hooks/nav/useNavItems.ts
import { useMemo } from "react";
import { useCategories } from "@/src/hooks/home/useCategories";
import { NAV_ITEMS } from "@/src/config/nav-config";

export function useNavItems() {
  const { data: allCategories } = useCategories();

  return useMemo(() => {
    return NAV_ITEMS.map((item) => {
      return item;
    });
  }, [allCategories]);
}