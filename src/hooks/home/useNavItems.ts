// src/hooks/nav/useNavItems.ts
import { useMemo } from "react";
import { useCategories } from "@/src/hooks/home/useCategories";
import { NAV_ITEMS } from "@/src/config/nav-config";

export function useNavItems() {
  const { data: allCategories } = useCategories();

  return useMemo(() => {
    const firstCategory = allCategories?.find((cat) => cat.parent_id === 1);

    return NAV_ITEMS.map((item) => {
      if (item.id === "deals" && firstCategory) {
        return {
          ...item,
          href: `/category/${firstCategory.id}/${firstCategory.slug}`,
        };
      }
      return item;
    });
  }, [allCategories]);
}