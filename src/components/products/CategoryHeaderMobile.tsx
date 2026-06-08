"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import type { Category } from "@/src/types/home/category";
import MobileCategoriesModal from "./MobileCategoriesModal";

interface CategoryHeaderMobileProps {
  category: Category;
  allCategories: Category[];
  cartCount?: number;
  onSearch?: () => void;
}

export function CategoryHeaderMobile({
  category,
  allCategories,
  cartCount = 0,
  onSearch,
}: CategoryHeaderMobileProps) {
  const t = useTranslations("product");
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Fixed top bar */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 h-14"
        style={{
          backgroundColor: "var(--color-bg)",
          borderBottom: "1px solid var(--color-border)",
          boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors -ml-1"
          style={{ color: "var(--color-primary)" }}
          aria-label={t("goBack")}
        >
          <ChevronLeftIcon className="w-5 h-5" strokeWidth={2.5} />
        </button>

        {/* Category name + dropdown trigger */}
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 flex-1 justify-center group"
          aria-label={t("changeCategory")}
        >
          <span
            className="text-base font-bold truncate max-w-[200px] transition-opacity group-hover:opacity-75"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-primary)",
            }}
          >
            {category.name}
          </span>
          <ChevronDownIcon
            className="w-4 h-4 shrink-0 transition-transform group-hover:translate-y-0.5"
            style={{ color: "var(--color-primary)" }}
          />
        </button>

        {/* Search + Cart */}
        <div className="flex items-center gap-1">
          <button
            onClick={onSearch}
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ color: "var(--color-text-muted)" }}
            aria-label={t("search")}
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push("/cart")}
            className="relative w-9 h-9 flex items-center justify-center rounded-full"
            style={{ color: "var(--color-text-muted)" }}
            aria-label={t("cart")}
          >
            <ShoppingCartIcon className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Categories modal */}
      {modalOpen && (
        <MobileCategoriesModal
          categories={allCategories}
          activeId={category.id}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}