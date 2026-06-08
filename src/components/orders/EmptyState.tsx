// app/orders/components/EmptyState.tsx
"use client";

import { useRouter } from "next/navigation";
import type { OrderFilter } from "@/src/config/order";
import { useTranslations } from "next-intl";

interface EmptyStateProps {
  filter: OrderFilter;
}

export function EmptyState({ filter }: EmptyStateProps) {
  const router = useRouter();
  const t = useTranslations("orders");

  const getMessage = () => {
    switch (filter) {
      case "all":
        return {
          emoji: "🛍️",
          title: t("emptyAllTitle"),
          subtitle: t("emptyAllSubtitle"),
          showCTA: true,
        };
      case "active":
        return {
          emoji: "⏳",
          title: t("emptyActiveTitle"),
          subtitle: t("emptyActiveSubtitle"),
          showCTA: false,
        };
      case "completed":
        return {
          emoji: "✅",
          title: t("emptyCompletedTitle"),
          subtitle: t("emptyCompletedSubtitle"),
          showCTA: false,
        };
      case "cancelled":
        return {
          emoji: "❌",
          title: t("emptyCancelledTitle"),
          subtitle: t("emptyCancelledSubtitle"),
          showCTA: false,
        };
      default:
        return {
          emoji: "🛍️",
          title: t("emptyAllTitle"),
          subtitle: t("emptyAllSubtitle"),
          showCTA: true,
        };
    }
  };

  const msg = getMessage();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <span className="text-6xl mb-5 select-none">{msg.emoji}</span>
      <h3
        className="text-lg font-bold mb-2"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-text)",
        }}
      >
        {msg.title}
      </h3>
      <p
        className="text-sm leading-relaxed max-w-xs"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {msg.subtitle}
      </p>
      {msg.showCTA && (
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-8 py-3 rounded-full font-semibold text-sm transition-all active:scale-95"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "#fff",
            fontFamily: "var(--font-sans)",
            boxShadow: "0 4px 14px rgba(181,23,158,0.30)",
          }}
        >
          {t("startShopping")}
        </button>
      )}
    </div>
  );
}
