"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { SearchModal } from "@/src/components/search/SearchModal";

export function SearchBar() {
  const t = useTranslations("home");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className=" pt-4 pb-2">
        <div
          className="flex items-center gap-3 rounded-sm border overflow-hidden cursor-pointer"
          style={{
            backgroundColor: "var(--color-bg)",
            borderColor: "var(--color-border)",
          }}
          onClick={() => setIsOpen(true)}
        >
          <input
            readOnly
            placeholder={t("search.placeholder")}
            className="flex-1 bg-transparent outline-none text-[0.9375rem] ps-4 py-3 cursor-pointer"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-text)" }}
          />
          <div
            className="flex items-center justify-center w-8 h-8 rounded-xl me-1 shrink-0"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <MagnifyingGlassIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}