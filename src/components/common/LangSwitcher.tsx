"use client";

import { usePathname, useRouter } from "@/src/i18n/navigation";
import { Languages } from "lucide-react";
import { getCurrentLocale } from "@/src/i18n/getCurrentLocale";

export default function LangSwitcher({ onSelect }: { onSelect?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = getCurrentLocale();

  const toggleLanguage = () => {
    const newLocale = currentLocale === "en" ? "eg" : "en";
    router.replace(pathname, { locale: newLocale });
    onSelect?.();
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
      style={{
        color: "var(--color-text)",
        fontFamily: "var(--font-sans)",
        backgroundColor: "var(--color-bg)",
        border: "1px solid var(--color-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-bg-subtle)";
        e.currentTarget.style.borderColor = "var(--color-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-bg)";
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
    >
      <Languages size={16} />
      <span>{currentLocale === "en" ? "العربية" : "English"}</span>
    </button>
  );
}
