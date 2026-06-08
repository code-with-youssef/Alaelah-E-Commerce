"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCardIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { SavedCard } from "@/src/config/settings";
import { SettingsLayout } from "../SettingsLayout";
import { useTranslations } from "next-intl";

function CardBrandIcon({ brand }: { brand: SavedCard["brand"] }) {
  const t = useTranslations("settings");
  
  // Simple text badge — replace with real SVG brand logos
  const labels: Record<SavedCard["brand"], string> = {
    visa: "VISA",
    mastercard: "MC",
    amex: "AMEX",
    other: t("cardOther"),
  };
  return (
    <span
      className="text-[10px] font-black px-1.5 py-0.5 rounded"
      style={{
        backgroundColor:
          brand === "visa"
            ? "#1a1f71"
            : brand === "mastercard"
              ? "#eb001b"
              : "var(--color-text-muted)",
        color: "#fff",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.05em",
      }}
    >
      {labels[brand]}
    </span>
  );
}

interface SavedCardsClientProps {
  initialCards: SavedCard[];
  onDelete?: (id: number) => Promise<void>;
}

export function SavedCardsClient({
  initialCards,
  onDelete,
}: SavedCardsClientProps) {
  const t = useTranslations("settings");
  const router = useRouter();
  const [cards, setCards] = useState(initialCards);

  const handleDelete = async (id: number) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    await onDelete?.(id);
  };

  return (
    <SettingsLayout
      title={t("savedCardsTitle")}
      rightAction={
        <button
          onClick={() => router.push("/settings/saved-cards/add")}
          aria-label={t("addCardAria")}
          className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
          style={{ color: "var(--color-primary)" }}
        >
          <PlusIcon className="w-6 h-6" strokeWidth={2} />
        </button>
      }
    >
      {cards.length === 0 ? (
        /* ── Empty state ── */
        <div className="flex flex-col items-center justify-center flex-1 py-20 gap-5">
          {/* Card icon from Heroicons */}
          <CreditCardIcon className="w-16 h-16 text-gray-300" />

          <div className="text-center">
            <p
              className="text-xl font-bold mb-2"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
              }}
            >
              {t("noSavedCards")}
            </p>
            <p
              className="text-sm text-center max-w-xs"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t("noSavedCardsHint")}
            </p>
          </div>

          <button
            onClick={() => router.push("/settings/saved-cards/add")}
            className="rounded-2xl px-8 py-3.5 text-base font-bold text-white transition-all active:scale-[0.98]"
            style={{
              backgroundColor: "var(--color-primary)",
              fontFamily: "var(--font-display)",
            }}
          >
            {t("addCardButton")}
          </button>
        </div>
      ) : (
        /* ── Cards list ── */
        <div className="mt-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex items-center gap-3 py-4"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <CardBrandIcon brand={card.brand} />

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-bold"
                  style={{
                    fontFamily: "var(--font-sans)",
                    color: "var(--color-text)",
                  }}
                >
                  •••• •••• •••• {card.last4}
                </p>
                <p
                  className="text-xs"
                  style={{
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {card.label ? `${card.label} · ` : ""}{t("expires")} {card.expiry}
                </p>
              </div>

              <button
                onClick={() => handleDelete(card.id)}
                aria-label={t("removeCardAria")}
                className="w-8 h-8 flex items-center justify-center rounded-full active:scale-90 transition-transform"
                style={{ color: "var(--color-text-muted)" }}
              >
                <TrashIcon className="w-4 h-4" strokeWidth={1.8} />
              </button>
            </div>
          ))}
        </div>
      )}
    </SettingsLayout>
  );
}